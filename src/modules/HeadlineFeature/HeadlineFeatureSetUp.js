
export default function HeadlineFeatureSetUp(headlines) {



  const finalHeadlines = headlines.map((item) => {

    return{
      Author: item.attributes['Author'],
      Headline: item.attributes['Headline'],
      HeadlineContent: item.attributes['HeadlineContent'],
      Title: item.attributes['Title'],
      Type: item.attributes['Type']
    }
  })
  




  return finalHeadlines
}

