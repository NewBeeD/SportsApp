

export const queryParams_div1_teams = {
  
  populate: {
    dfa_players: {
      populate: true
    },
  }   
}

export const queryParams_prem_teams = {
  
  populate: {
    dfa_players: {
      populate: true
    },
  }   
}

export const queryParams_women_teams = {
  
  populate: {
    dfa_players: {
      populate: true
    },
  }  
}

export const queryParams_div1_table = {
  
  populate: {
    dfa_division_one_team: {
      populate: true
    },
  }   
}

export const queryParams_women_table = {
  
  populate: {
    dfa_women_team: {
      populate: true
    },
  }   
}

export const queryParams_prem_table = {
  
  populate: {
    dfa_team: {
      populate: true
    },
  }   
}

export const queryParams_fixtures = {
  
  populate: {
    all_league: {
      populate: true
    },
    venue:{
      populate: true
    },
  }   
}

// Football players
export const queryParams_prem_players = {
  
  populate: {
    dfa_team: {
      populate: true
    },
    all_league:{
      populate: true
    },
    Profile_Pic:{
      populate: true
    }
  }   
}





// Basketball players
export const queryParams_daba_players = {
  
  populate: {
    daba_team: {
      populate: true
    },
    all_league:{
      populate: true
    },
    Profile_Pic:{
      populate: true
    }
  }   
}

// Football Player Stats
export const queryParams_prem_players_stats = {
  
  populate: {
    dfa_player: {
      populate: {
        Profile_Pic: {
          populate: true,
        },
        all_league:{
          populate: true
        },
        dfa_team:{
          populate: true
        }
      },
    },
    all_league:{
      populate: true
    },
    Profile_Pic:{
      populate: true
    },
    dfa_team:{
      populate: true
    }
  }   
}

// Basketball player stats
export const queryParams_daba_players_stats = {
  
  populate: {
    dfa_player: {
      populate: true
    },
    all_league:{
      populate: true
    },
    Profile_Pic:{
      populate: true
    },
    dfa_team:{
      populate: true
    }
  }   
}


export const queryParams_articles = {
  
  populate: {
    Article_img: {
      populate: true
    },

    all_league: {
      populate: true
    },

    Article_Img: {
      populate: true
    },

  }   
}


export const queryParams_comments = {
  
  populate: {
    article: {
      populate: true
    }
  }   
}

// Football teams
export const queryParams_dfa_teams = {
  
  populate: {
    dfa_players: {
      populate: {
        Profile_Pic: { fields: ['url'] } // Ensure Player_Image is fetched
      },
    },
    dfa_league:{
      populate: true
    },
    Team_Crest: {
      populate: true
    },
    Staff: {
      populate: true
    },
    Team_Photo: {
      populate: true
    }

  }   
}

// Basketball teams
export const queryParams_daba_teams = {
  
  populate: {
    dfa_players: {
      populate: true
    },
    dfa_league:{
      populate: true
    },
    Team_Crest: {
      populate: true
    },
    Staff: {
      populate: true
    }
  }   
}

// Headline Feature
export const queryParams_headlinefeature = {
  
  populate: {
    CardImage: {
      populate: true
    }
  }   
}




// Football players
export const queryParams_prem_players_season_stats = {
  
  // populate: {
  //   dfa_player: {
  //     populate: true
  //   },

  // } 
  

  populate: {
    dfa_player: {
      populate: true
    }
  },
  sort: 'Season:desc'
};






