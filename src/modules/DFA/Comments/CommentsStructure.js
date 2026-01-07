

export default function CommentsStructure(data){


  const final_data = data.map(item => {

    let data_point = {}

    data_point['author'] = item.attributes.Author
    data_point['content'] = item.attributes.content
    data_point['date_published'] = item.attributes.publishedAt
    data_point['reaction'] = item.attributes.reaction
    data_point['Article_id'] = item.attributes.article.data.id

    return data_point
  })


  return final_data
}