


export default function VideoStructure(video_data){

  let videos = video_data.map(item => {

    let video = {}

    video['VideoId'] = item.attributes['VideoId']
    video['Location'] = item.attributes['Page_Location']

    return video   
  })

  return videos
}



 


