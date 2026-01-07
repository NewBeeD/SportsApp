

export default function headlineFeatureModule(data){


  const headlines = data.filter(item => item.attributes.Page_Headline === 'Yes' || item.attributes.Headline === 'Yes')
  .map(item => {
    
    return {
      author: item.attributes.Author,
      headline: item.attributes.Headline,
      Mainheadline: item.attributes.Page_Headline,
      title: item.attributes.Title,
      type: item.attributes.Type,
      image: item.attributes.Article_Img?.data?.[0]?.attributes?.url || '',
      id: item.id
    };
  });  

  return headlines 

}