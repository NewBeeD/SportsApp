// export default function PlayerStatsDisplay(data) {

//   if(data == null){return []}


//   let player = {};

//   player['Assists'] = data[0].attributes.Assists ?? 0; 
//   player['CleanSheets'] = data[0].attributes.Clean_Sheets ?? 0;
//   player['Goals'] = data[0].attributes.Goals ?? 0;
//   player['Appearances'] = data[0].attributes.Matches_Played ?? 0;
//   player['RedCards'] = data[0].attributes.RedCards ?? 0;
//   player['YellowCards'] = data[0].attributes.YellowCards ?? 0;


  
//   return player
  
// }




// Constants for default values
const DEFAULT_STATS = {
  Assists: 0,
  CleanSheets: 0,
  Goals: 0,
  Appearances: 0,
  RedCards: 0,
  YellowCards: 0,
  MOTM: 0
};

// Map source field names to output field names
const FIELD_MAPPINGS = {
  Assists: 'Assists',
  Clean_Sheets: 'CleanSheets',
  Goals: 'Goals',
  Matches_Played: 'Appearances',
  RedCards: 'RedCards',
  YellowCards: 'YellowCards'
};

const firstDefined = (...values) => {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return undefined;
};

export default function transformPlayerStats(data) {
  // Validate input
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('Invalid or empty data provided to transformPlayerStats');
    return { ...DEFAULT_STATS };
  }

  const playerData = data[0];
  
  // Check if player data exists and has attributes
  if (!playerData || typeof playerData.attributes !== 'object') {
    console.warn('Player data structure is invalid');
    return { ...DEFAULT_STATS };
  }

  const attributes = playerData.attributes;
  const transformedStats = { ...DEFAULT_STATS };

  // Transform each field
  Object.entries(FIELD_MAPPINGS).forEach(([sourceField, targetField]) => {
    if (attributes[sourceField] !== undefined) {
      transformedStats[targetField] = attributes[sourceField];
    }
  });

  // Man of the Match (support common field name variants)
  const motm = firstDefined(
    attributes.MOTM,
    attributes.Motm,
    attributes.Man_Of_The_Match,
    attributes.ManOfTheMatch,
    attributes.MOTM_Awards,
    attributes.MOTM_awards,
    attributes.ManOfMatch
  );
  if (motm !== undefined) {
    transformedStats.MOTM = motm;
  }

  return transformedStats;
}