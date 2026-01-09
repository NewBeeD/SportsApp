


export default function VideoStructure(video_data){


  
  

  let videos = video_data.map(item => {

    let video = {}

    video['id'] = item.id
    video['VideoId'] = item.attributes['VideoId']
    video['Location'] = item.attributes['Location']
    video['Title'] = item.attributes['Title'] || 'Untitled'
    video['Description'] = item.attributes['Description'] || ''
    video['CreatedAt'] = item.attributes['createdAt'] || item.attributes['publishedAt']

    return video   
  })


  return videos
}



 


