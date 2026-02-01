import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

// Only import InputAdornment if actually needed
import InputAdornment from '@mui/material/InputAdornment';

import { useMemo, useState, useEffect, useCallback } from 'react'

import axios from 'axios'
import qs from 'qs'

import PropTypes from 'prop-types'

// Firebase setup
import { auth } from '../../config/firebaseConfig'
import { onAuthStateChanged } from "@firebase/auth"

import CommentsStructure from '../../modules/DFA/Comments/CommentsStructure'
// import AddCommentIcon from '@mui/icons-material/AddComment';
import SendIcon from '@mui/icons-material/Send';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

import '../../css/comments.css'
import theme from '../../css/theme'




const getReactionCounts = (reaction) => {
  const safe = reaction ?? {};
  return {
    thumbsUp: Number(safe.thumbsUp ?? 0),
    heart: Number(safe.heart ?? 0),
    smiley: Number(safe.smiley ?? 0),
    // IMPORTANT: preserve replyTo if it exists since we use it for threading.
    replyTo: safe.replyTo ?? null,
    deleted: safe.deleted ?? false,
  };
};


const Comments = ({ articleId }) => {

  const [userSignedIn, setUserSignedIn] = useState(null)

  const [isAdmin, setIsAdmin] = useState(false);

  const [author, setAuthor] = useState(null)

  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [replyingTo, setReplyingTo] = useState(null); // { id: string, author: string }
  const [replyDrafts, setReplyDrafts] = useState({});
  const [showRepliesFor, setShowRepliesFor] = useState({});
  const [reactingIds, setReactingIds] = useState({});

  const [deletingIds, setDeletingIds] = useState({});
  const [deleteDialog, setDeleteDialog] = useState({ open: false, comment: null, replyIds: [] });

  const [editingId, setEditingId] = useState(null);
  const [editDrafts, setEditDrafts] = useState({});
  const [savingEditIds, setSavingEditIds] = useState({});

  const STRAPI_BASE_URL = 'https://strapi-dominica-sport.onrender.com';

  const normalizeStrapiCreateResponse = (responseData) => {
    // Strapi v4 typically returns { data: { id, attributes } }
    // but we defensively support a few shapes.
    if (!responseData) return null;

    if (responseData.data?.id != null) return responseData.data;
    if (responseData.id != null && responseData.attributes) return responseData;
    if (Array.isArray(responseData.data) && responseData.data[0]?.id != null) return responseData.data[0];
    return null;
  };

  const mapStrapiComment = (item) => {
    if (!item?.attributes) return null;
    return {
      id: item.id,
      author: item.attributes.Author,
      content: item.attributes.content,
      date_published: item.attributes.publishedAt,
      createdAt: item.attributes.createdAt,
      reaction: item.attributes.reaction,
      replyTo: item.attributes?.reaction?.replyTo ?? null,
      Article_id: item.attributes?.article?.data?.id ?? null,
    };
  };

  const setReacting = (commentId, value) => {
    const key = String(commentId);
    setReactingIds((prev) => ({ ...prev, [key]: value }));
  };

  const setDeleting = (commentId, value) => {
    const key = String(commentId);
    setDeletingIds((prev) => ({ ...prev, [key]: value }));
  };

  const setSavingEdit = (commentId, value) => {
    const key = String(commentId);
    setSavingEditIds((prev) => ({ ...prev, [key]: value }));
  };

  const isDeletedComment = useCallback((comment) => {
    if (!comment) return false;
    return comment?.reaction?.deleted === true || String(comment?.content ?? '').trim() === '[deleted]';
  }, []);

  const canDeleteComment = useCallback((comment) => {
    if (!comment) return false;
    if (!userSignedIn) return false;
    if (comment.__optimistic) return false;
    if (isAdmin) return true;
    if (!author || !comment.author) return false;
    return String(comment.author).trim() === String(author).trim();
  }, [author, isAdmin, userSignedIn]);

  const requestDelete = (comment, hasReplies = false) => {
    if (!comment) return;
    const replyIds = hasReplies ? (threaded.repliesByParent.get(String(comment.id)) ?? []).map((r) => r?.id).filter(Boolean) : [];
    setDeleteDialog({ open: true, comment, replyIds });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, comment: null, replyIds: [] });
  };

  const performDelete = useCallback(async (comment, replyIds = []) => {
    if (!comment) return;
    const commentId = comment.id;
    const key = String(commentId);
    if (key.startsWith('client-')) return;
    if (!canDeleteComment(comment)) return;

    const snapshot = comments;
    setError(null);
    setDeleting(commentId, true);

    const idsToDelete = [
      ...(replyIds ?? []).map((id) => String(id)).filter((id) => !!id && !id.startsWith('client-')),
      key,
    ];

    // Optimistic UI update: remove parent + replies.
    setComments((prev) => prev.filter((c) => !idsToDelete.includes(String(c?.id))));

    try {
      // Delete children first, then parent.
      for (const id of idsToDelete) {
        await axios.delete(`${STRAPI_BASE_URL}/api/comments/${id}`);
      }
    } catch (e) {
      setComments(snapshot);
      setError('Could not delete comment. Please try again.');
    } finally {
      setDeleting(commentId, false);
    }
  }, [STRAPI_BASE_URL, canDeleteComment, comments]);

  const canEditComment = useCallback((comment) => {
    if (!comment) return false;
    if (!userSignedIn) return false;
    if (comment.__optimistic) return false;
    if (isDeletedComment(comment)) return false;
    if (isAdmin) return true;
    if (!author || !comment.author) return false;
    return String(comment.author).trim() === String(author).trim();
  }, [author, isAdmin, isDeletedComment, userSignedIn]);

  const startEdit = (comment) => {
    if (!comment) return;
    const id = String(comment.id);
    if (!canEditComment(comment)) return;
    setEditingId(id);
    setEditDrafts((prev) => ({ ...prev, [id]: comment.content ?? '' }));
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = useCallback(async (comment) => {
    if (!comment) return;
    const id = String(comment.id);
    if (id.startsWith('client-')) return;
    if (!canEditComment(comment)) return;

    const draft = (editDrafts[id] ?? '').trim();
    if (!draft) return;
    if (draft === String(comment.content ?? '').trim()) {
      setEditingId(null);
      return;
    }

    const snapshot = comments;
    setError(null);
    setSavingEdit(id, true);

    // Optimistic update
    setComments((prev) => prev.map((c) => {
      if (String(c?.id) !== id) return c;
      return { ...c, content: draft };
    }));

    try {
      const payload = { data: { content: draft } };
      await axios.put(`${STRAPI_BASE_URL}/api/comments/${id}`, payload);
      setEditingId(null);
    } catch (e) {
      setComments(snapshot);
      setError('Could not save edit. Please try again.');
    } finally {
      setSavingEdit(id, false);
    }
  }, [STRAPI_BASE_URL, canEditComment, comments, editDrafts]);

  const reactToComment = useCallback(async (commentId, reactionKey) => {
    // Don’t react to optimistic / not-yet-saved records.
    if (String(commentId).startsWith('client-')) return;
    const key = String(commentId);
    if (reactingIds[key]) return;

    const current = comments?.find((c) => String(c?.id) === key);
    if (!current) return;

    const currentCounts = getReactionCounts(current.reaction);
    const nextCounts = {
      ...currentCounts,
      [reactionKey]: (currentCounts[reactionKey] ?? 0) + 1,
    };

    // Optimistic UI update
    setComments((prev) => prev.map((c) => {
      if (String(c?.id) !== key) return c;
      return { ...c, reaction: nextCounts };
    }));

    setReacting(commentId, true);
    try {
      const payload = {
        data: {
          // Keep the full reaction JSON object; includes replyTo when applicable.
          reaction: nextCounts,
        }
      };
      await axios.put(`${STRAPI_BASE_URL}/api/comments/${commentId}`, payload);
    } catch (e) {
      // Rollback optimistic update
      setComments((prev) => prev.map((c) => {
        if (String(c?.id) !== key) return c;
        return { ...c, reaction: currentCounts };
      }));
      setError('Could not save reaction. Please try again.');
    } finally {
      setReacting(commentId, false);
    }
  }, [STRAPI_BASE_URL, comments, reactingIds]);

  const submitComment = useCallback(async ({ content, replyTo = null }) => {
    const trimmed = (content ?? '').trim();
    if (!trimmed) return;
    if (!userSignedIn || !author || !articleId) return;
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    const clientId = `client-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const optimistic = {
      id: clientId,
      author,
      content: trimmed,
      date_published: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      reaction: { thumbsUp: 0, heart: 0, smiley: 0, ...(replyTo ? { replyTo } : {}) },
      replyTo,
      Article_id: Number(articleId),
      __optimistic: true,
    };

    if (replyTo != null) {
      const parentKey = String(replyTo);
      setShowRepliesFor((prev) => ({ ...prev, [parentKey]: true }));
    }

    setComments((prev) => [optimistic, ...prev]);

    try {
      const payload = {
        data: {
          Author: author,
          content: trimmed,
          article: Number(articleId),
          // No reply field exists in Strapi; we encode replyTo inside the existing JSON reaction field.
          reaction: { thumbsUp: 0, heart: 0, smiley: 0, ...(replyTo ? { replyTo } : {}) },
        }
      };

      const response = await axios.post(`${STRAPI_BASE_URL}/api/comments`, payload);
      const created = normalizeStrapiCreateResponse(response.data);
      const mapped = mapStrapiComment(created);

      if (!mapped) {
        // If we can't map, keep the optimistic entry.
        return;
      }

      // Ensure Article_id is present even if Strapi didn't return populated relation.
      if (!mapped.Article_id) mapped.Article_id = Number(articleId);

      setComments((prev) => prev.map((c) => (c.id === clientId ? mapped : c)));
    } catch (e) {
      // Roll back optimistic item.
      setComments((prev) => prev.filter((c) => c.id !== clientId));
      setError('Error submitting comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [author, articleId, submitting, userSignedIn]);

  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth, async (user) =>{
      if(user){
        setUserSignedIn(true)
        setAuthor(user.displayName ?? user.email ?? 'Anonymous')

        try {
          const tokenResult = await user.getIdTokenResult(true);
          setIsAdmin(!!tokenResult?.claims?.admin);
        } catch (e) {
          setIsAdmin(false);
        }
      }
      else{
        setUserSignedIn(false)
        setAuthor(null)
        setIsAdmin(false)
      }
    })

    return () => unsubscribe();
  }, [])

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        // Set loading to true when starting the fetch
        setLoading(true);
        setError(null);

        const queryObject = {
          filters: {
            article: {
              id: {
                $eq: Number(articleId),
              },
            },
          },
          populate: {
            article: { fields: ['id'] },
          },
          sort: ['createdAt:desc'],
          pagination: {
            page: 1,
            pageSize: 200,
          },
        };

        const queryString = qs.stringify(queryObject, { encodeValuesOnly: true });

        const apiUrl = `${STRAPI_BASE_URL}/api/comments?${queryString}`;

        const response = await axios.get(apiUrl);
        
        // Check if the request was successful (status code 2xx)
        if (response.status !== 200) {
          throw new Error(`Error: ${response.statusText}`);
        }

        // Parse the JSON data
        const result = await response.data.data;

        let final_data = CommentsStructure(result)

        // Set the data state
        setComments(final_data);
        // setModalIsOpen(true);
      } catch (error) {
        // Set the error state if there's an issue
        setError(error.message);
      } finally {
        // Set loading to false regardless of success or failure
        setLoading(false);
      }
    };

    // Call the fetchData function when the component mounts
    if (articleId) {
      fetchData();
    }

  }, [articleId]);

  const threaded = useMemo(() => {
    const topLevel = [];
    const repliesByParent = new Map();

    for (const c of comments || []) {
      if (!c) continue;
      if (c.replyTo != null) {
        const parentId = String(c.replyTo);
        const bucket = repliesByParent.get(parentId) ?? [];
        bucket.push(c);
        repliesByParent.set(parentId, bucket);
      } else {
        topLevel.push(c);
      }
    }

    // Sort replies oldest->newest for readability
    for (const [parentId, list] of repliesByParent.entries()) {
      list.sort((a, b) => new Date(a.createdAt ?? a.date_published ?? 0) - new Date(b.createdAt ?? b.date_published ?? 0));
      repliesByParent.set(parentId, list);
    }

    // Top-level newest->oldest
    topLevel.sort((a, b) => new Date(b.createdAt ?? b.date_published ?? 0) - new Date(a.createdAt ?? a.date_published ?? 0));

    return { topLevel, repliesByParent };
  }, [comments]);

  const visibleTopLevel = useMemo(() => {
    return (threaded.topLevel || []).filter((c) => String(c.Article_id) === String(articleId));
  }, [threaded.topLevel, articleId]);

  const onToggleReplies = (commentId) => {
    const key = String(commentId);
    setShowRepliesFor((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const onStartReply = (commentId) => {
    const key = String(commentId);
    const parent = comments?.find((c) => String(c?.id) === key);
    setReplyingTo({ id: key, author: parent?.author ?? 'user' });
    setShowRepliesFor((prev) => ({ ...prev, [key]: true }));
  };

  const onCancelReply = () => {
    setReplyingTo(null);
  };

  const onChangeReplyDraft = (commentId, value) => {
    const key = String(commentId);
    setReplyDrafts((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmitReply = async (commentId) => {
    const key = String(commentId);
    const draft = replyDrafts[key] ?? '';
    setShowRepliesFor((prev) => ({ ...prev, [key]: true }));
    await submitComment({ content: draft, replyTo: Number(commentId) });
    setReplyDrafts((prev) => ({ ...prev, [key]: '' }));
    setReplyingTo(null);
  };



  return (
    <Box
      sx={{
        mt: 2,
        p: { xs: 1.5, sm: 2 },
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: 3,
      }}
    >

      <Box sx={{ mb: 1.5 }}>
        <Typography
          variant="h6"
          sx={{
            color: theme.colors.textPrimary,
            fontWeight: 800,
            letterSpacing: 0.2,
          }}
        >
          Comments
        </Typography>
        <Divider sx={{ mt: 1, borderColor: theme.colors.divider }} />
      </Box>

      {error ? (
        <Box marginBottom={1.5}>
          <Alert severity="error">{error}</Alert>
        </Box>
      ) : null}

      {loading ? (
        <Skeleton variant='rectangle' height={70} sx={{ borderRadius: 2 }} />
      ) : null}

      {!loading && visibleTopLevel.length === 0 ? (
        <Typography variant="body2" sx={{ opacity: 0.85, mb: 1.5 }}>
          No comments yet. Be the first to comment.
        </Typography>
      ) : null}

      {!loading && visibleTopLevel.length > 0 ? visibleTopLevel.map((item) => {
        const itemId = String(item.id);
        const replies = threaded.repliesByParent.get(itemId) ?? [];
        const repliesOpen = !!showRepliesFor[itemId];
        const isReplyingHere = replyingTo?.id === itemId;
        const hasReplies = replies.length > 0;
        const itemDeleted = isDeletedComment(item);
        const canDeleteTop = canDeleteComment(item);
        const canEditTop = canEditComment(item);
        const topBusy = !!deletingIds[itemId] || item.__optimistic;
        const savingTopEdit = !!savingEditIds[itemId];
        const isEditingHere = editingId === itemId;

        return(
          <Box key={itemId} marginBottom={1}>

            <Card
              elevation={0}
              sx={{
                padding: 0,
                backgroundColor: theme.colors.background,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >

              <CardContent>

                <Box display="flex" alignItems="center" justifyContent="space-between" gap={1}>
                  <Typography
                    variant='body2'
                    sx={{
                      fontWeight: 800,
                      marginBottom: '2px',
                      color: theme.colors.textPrimary,
                    }}
                  >
                    {item.author}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={1}>
                    {item.__optimistic ? (
                      <>
                        <CircularProgress size={14} sx={{ color: theme.colors.accent }} />
                        <Typography variant="caption" sx={{ color: theme.colors.textSecondary, opacity: 0.9 }}>
                          Sending...
                        </Typography>
                      </>
                    ) : null}

                    {canEditTop ? (
                      <Tooltip title="Edit">
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => startEdit(item)}
                            disabled={topBusy || savingTopEdit}
                            sx={{ color: theme.colors.textSecondary }}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    ) : null}

                    {canDeleteTop ? (
                      <Tooltip title={hasReplies ? `Delete (also deletes ${replies.length} repl${replies.length === 1 ? 'y' : 'ies'})` : 'Delete'}>
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => requestDelete(item, hasReplies)}
                            disabled={topBusy || savingTopEdit}
                            sx={{ color: theme.colors.textSecondary }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    ) : null}
                  </Box>
                </Box>

                {!isEditingHere ? (
                  <Typography
                    variant='body2'
                    sx={{
                      color: theme.colors.textSecondary,
                      fontStyle: itemDeleted ? 'italic' : 'normal',
                      opacity: itemDeleted ? 0.85 : 1,
                    }}
                  >
                    {item.content}
                  </Typography>
                ) : (
                  <Box sx={{ mt: 0.5 }}>
                    <TextField
                      value={editDrafts[itemId] ?? ''}
                      onChange={(e) => setEditDrafts((prev) => ({ ...prev, [itemId]: e.target.value }))}
                      fullWidth
                      multiline
                      rows={2}
                      disabled={savingTopEdit}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: theme.colors.background,
                          borderRadius: 2,
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onClick={cancelEdit}
                              disabled={savingTopEdit}
                              sx={{ mr: 0.5 }}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              edge='end'
                              onClick={() => saveEdit(item)}
                              disabled={savingTopEdit || !(editDrafts[itemId] ?? '').trim()}
                            >
                              <CheckIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                )}

                {/* Reactions */}
                <Box display="flex" alignItems="center" gap={1} marginTop={1}>
                  {(() => {
                    const counts = getReactionCounts(item.reaction);
                    const busy = !!reactingIds[itemId] || item.__optimistic || itemDeleted || isEditingHere || savingTopEdit;
                    return (
                      <>
                        <Tooltip title="Like">
                          <span>
                            <Button
                              size="small"
                              variant="text"
                              onClick={() => reactToComment(item.id, 'thumbsUp')}
                              disabled={busy}
                              sx={{ textTransform: 'none', minWidth: 0, paddingX: 0.5, color: theme.colors.textSecondary }}
                              startIcon={<ThumbUpAltOutlinedIcon fontSize="small" />}
                            >
                              {counts.thumbsUp}
                            </Button>
                          </span>
                        </Tooltip>

                        <Tooltip title="Love">
                          <span>
                            <Button
                              size="small"
                              variant="text"
                              onClick={() => reactToComment(item.id, 'heart')}
                              disabled={busy}
                              sx={{ textTransform: 'none', minWidth: 0, paddingX: 0.5, color: theme.colors.textSecondary }}
                              startIcon={<FavoriteBorderIcon fontSize="small" />}
                            >
                              {counts.heart}
                            </Button>
                          </span>
                        </Tooltip>

                        <Tooltip title="Funny">
                          <span>
                            <Button
                              size="small"
                              variant="text"
                              onClick={() => reactToComment(item.id, 'smiley')}
                              disabled={busy}
                              sx={{ textTransform: 'none', minWidth: 0, paddingX: 0.5, color: theme.colors.textSecondary }}
                              startIcon={<EmojiEmotionsOutlinedIcon fontSize="small" />}
                            >
                              {counts.smiley}
                            </Button>
                          </span>
                        </Tooltip>
                      </>
                    );
                  })()}
                </Box>

                <Box display="flex" gap={1} marginTop={1}>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => onStartReply(item.id)}
                    disabled={!userSignedIn || itemDeleted || isEditingHere || savingTopEdit}
                    sx={{ color: theme.colors.accent, textTransform: 'none', paddingX: 0, fontWeight: 700 }}
                  >
                    Reply
                  </Button>

                  {replies.length > 0 ? (
                    <Button
                      size="small"
                      variant="text"
                      onClick={() => onToggleReplies(item.id)}
                      sx={{ color: theme.colors.textSecondary, textTransform: 'none', paddingX: 0, opacity: 0.9, fontWeight: 700 }}
                    >
                      {repliesOpen ? 'Hide replies' : `View replies (${replies.length})`}
                    </Button>
                  ) : null}
                </Box>

                <Collapse in={isReplyingHere} timeout="auto" unmountOnExit>
                  <Box marginTop={1.2}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" gap={1} marginBottom={1}>
                      <Chip
                        size="small"
                        label={`Replying to ${replyingTo?.author ?? ''}`}
                        sx={{
                          backgroundColor: theme.colors.accentLight,
                          color: theme.colors.accentDark,
                          fontWeight: 700,
                        }}
                      />

                      <Button
                        size="small"
                        variant="text"
                        onClick={onCancelReply}
                        sx={{ textTransform: 'none', color: theme.colors.textSecondary, fontWeight: 700 }}
                      >
                        Cancel
                      </Button>
                    </Box>

                    <TextField
                      label={userSignedIn ? 'Write a reply' : 'Sign in to reply'}
                      value={replyDrafts[itemId] ?? ''}
                      onChange={(e) => onChangeReplyDraft(item.id, e.target.value)}
                      fullWidth
                      multiline
                      rows={2}
                      disabled={!userSignedIn || submitting}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: theme.colors.background,
                          borderRadius: 2,
                        },
                      }}
                      InputProps={{
                        endAdornment:(
                          <InputAdornment position='end'>
                            <IconButton
                              edge='start'
                              onClick={() => onSubmitReply(item.id)}
                              disabled={!userSignedIn || submitting || !(replyDrafts[itemId] ?? '').trim()}
                            >
                              <SendIcon />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Box>
                </Collapse>

                {replies.length > 0 ? (
                  <Collapse in={repliesOpen} timeout="auto" unmountOnExit>
                    <Box marginTop={1.2} paddingLeft={2} borderLeft={`3px solid ${theme.colors.accentLight}`}>
                      {replies.map((r) => (
                        <Box key={String(r.id)} marginBottom={1}>
                          {(() => {
                            const rid = String(r.id);
                            const rDeleted = isDeletedComment(r);
                            const canDeleteReply = canDeleteComment(r);
                            const canEditReply = canEditComment(r);
                            const replyBusy = !!deletingIds[rid] || r.__optimistic;
                            const savingReplyEdit = !!savingEditIds[rid];
                            const editingReply = editingId === rid;
                            return (
                              <>
                          <Box display="flex" alignItems="center" justifyContent="space-between" gap={1}>
                            <Typography variant='body2' sx={{ fontWeight: 800, color: theme.colors.textPrimary }}>
                              {r.author}
                            </Typography>

                            <Box display="flex" alignItems="center" gap={1}>
                            {r.__optimistic ? (
                              <Box display="flex" alignItems="center" gap={1}>
                                <CircularProgress size={14} sx={{ color: theme.colors.accent }} />
                                <Typography variant="caption" sx={{ color: theme.colors.textSecondary, opacity: 0.9 }}>
                                  Sending...
                                </Typography>
                              </Box>
                            ) : null}

                              {canEditReply ? (
                                <Tooltip title="Edit">
                                  <span>
                                    <IconButton
                                      size="small"
                                      onClick={() => startEdit(r)}
                                      disabled={replyBusy || savingReplyEdit}
                                      sx={{ color: theme.colors.textSecondary }}
                                    >
                                      <EditOutlinedIcon fontSize="small" />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                              ) : null}

                              {canDeleteReply ? (
                                <Tooltip title="Delete">
                                  <span>
                                    <IconButton
                                      size="small"
                                      onClick={() => setDeleteDialog({ open: true, comment: r, replyIds: [] })}
                                      disabled={replyBusy || savingReplyEdit}
                                      sx={{ color: theme.colors.textSecondary }}
                                    >
                                      <DeleteOutlineIcon fontSize="small" />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                              ) : null}
                            </Box>
                          </Box>

                          {!editingReply ? (
                            <Typography
                              variant='body2'
                              sx={{
                                color: theme.colors.textSecondary,
                                fontStyle: rDeleted ? 'italic' : 'normal',
                                opacity: rDeleted ? 0.85 : 1,
                              }}
                            >
                              {r.content}
                            </Typography>
                          ) : (
                            <Box sx={{ mt: 0.5 }}>
                              <TextField
                                value={editDrafts[rid] ?? ''}
                                onChange={(e) => setEditDrafts((prev) => ({ ...prev, [rid]: e.target.value }))}
                                fullWidth
                                multiline
                                rows={2}
                                disabled={savingReplyEdit}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    backgroundColor: theme.colors.background,
                                    borderRadius: 2,
                                  },
                                }}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position='end'>
                                      <IconButton
                                        edge='end'
                                        onClick={cancelEdit}
                                        disabled={savingReplyEdit}
                                        sx={{ mr: 0.5 }}
                                      >
                                        <CloseIcon fontSize="small" />
                                      </IconButton>
                                      <IconButton
                                        edge='end'
                                        onClick={() => saveEdit(r)}
                                        disabled={savingReplyEdit || !(editDrafts[rid] ?? '').trim()}
                                      >
                                        <CheckIcon fontSize="small" />
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Box>
                          )}

                          {/* Reply Reactions */}
                          <Box display="flex" alignItems="center" gap={1} marginTop={0.6}>
                            {(() => {
                              const counts = getReactionCounts(r.reaction);
                              const busy = !!reactingIds[rid] || r.__optimistic || rDeleted || editingReply || savingReplyEdit;
                              return (
                                <>
                                  <Tooltip title="Like">
                                    <span>
                                      <Button
                                        size="small"
                                        variant="text"
                                        onClick={() => reactToComment(r.id, 'thumbsUp')}
                                        disabled={busy}
                                        sx={{ textTransform: 'none', minWidth: 0, paddingX: 0.5, color: theme.colors.textSecondary }}
                                        startIcon={<ThumbUpAltOutlinedIcon fontSize="small" />}
                                      >
                                        {counts.thumbsUp}
                                      </Button>
                                    </span>
                                  </Tooltip>

                                  <Tooltip title="Love">
                                    <span>
                                      <Button
                                        size="small"
                                        variant="text"
                                        onClick={() => reactToComment(r.id, 'heart')}
                                        disabled={busy}
                                        sx={{ textTransform: 'none', minWidth: 0, paddingX: 0.5, color: theme.colors.textSecondary }}
                                        startIcon={<FavoriteBorderIcon fontSize="small" />}
                                      >
                                        {counts.heart}
                                      </Button>
                                    </span>
                                  </Tooltip>

                                  <Tooltip title="Funny">
                                    <span>
                                      <Button
                                        size="small"
                                        variant="text"
                                        onClick={() => reactToComment(r.id, 'smiley')}
                                        disabled={busy}
                                        sx={{ textTransform: 'none', minWidth: 0, paddingX: 0.5, color: theme.colors.textSecondary }}
                                        startIcon={<EmojiEmotionsOutlinedIcon fontSize="small" />}
                                      >
                                        {counts.smiley}
                                      </Button>
                                    </span>
                                  </Tooltip>
                                </>
                              );
                            })()}
                          </Box>
                              </>
                            );
                          })()}
                        </Box>
                      ))}
                    </Box>
                  </Collapse>
                ) : null}

              </CardContent>
            </Card>
          </Box>
        )
      }) : null}

      

      {/* <Card>

        <CardContent>

            

        </CardContent>

      </Card> */}

      <TextField
            label={userSignedIn? 'Write a comment': 'Sign in to comment'}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            fullWidth
            multiline
            rows={1}
            sx={{
              marginTop: 1,
              marginBottom: 0,
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.colors.background,
                borderRadius: 2,
              },
            }}
            InputProps={{
              endAdornment:(
              <InputAdornment position='end'>
                <IconButton
                  edge='start'
                  onClick={() => {
                    submitComment({ content: newComment, replyTo: null });
                    setNewComment('');
                  }}
                  disabled={!userSignedIn || submitting || !newComment.trim()}
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>)
            }}
            disabled={!userSignedIn || submitting}
            />      

      <Dialog open={deleteDialog.open} onClose={closeDeleteDialog}>
        <DialogTitle>Delete comment?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: theme.colors.textSecondary }}>
            {deleteDialog.replyIds?.length
              ? `This will permanently delete this comment and ${deleteDialog.replyIds.length} repl${deleteDialog.replyIds.length === 1 ? 'y' : 'ies'}.`
              : 'This will permanently delete the comment.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            sx={{ textTransform: 'none' }}
            onClick={async () => {
              const c = deleteDialog.comment;
              const replyIds = deleteDialog.replyIds;
              closeDeleteDialog();
              await performDelete(c, replyIds);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  )
}

Comments.propTypes = {
  articleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default Comments