export interface PitchData {
  ball_percentage: number;
  in_play_percentage: number;
  strike_percentage: number;
  total_pitch_count: number;
  total_pitch_percentage: number;
}
export const pitchNameMap: { [key: string]: string } = {
  CH: 'Changeup',
  CU: 'Curveball',
  FC: 'Cutter',
  EP: 'Eephus',
  FO: 'Forkball',
  FF: 'Four-Seam Fastball',
  KN: 'Knuckleball',
  KC: 'Knuckle-curve',
  SC: 'Screwball',
  SI: 'Sinker',
  SL: 'Slider',
  SV: 'Slurve',
  FS: 'Splitter',
  ST: 'Sweeper',
};
export const pitchColorMap: { [key: string]: string } = {
  CH: '#42A5F5', // Blue for Changeup
  CU: '#66BB6A', // Green for Curveball
  FC: '#FF7043', // Orange for Cutter
  EP: '#AB47BC', // Purple for Eephus
  FO: '#FFEB3B', // Yellow for Forkball
  FF: '#E53935', // Red for Four-Seam Fastball
  KN: '#8E24AA', // Deep Purple for Knuckleball
  KC: '#5C6BC0', // Blue Grey for Knuckle-curve
  SC: '#7B1FA2', // Purple for Screwball
  SI: '#009688', // Teal for Sinker
  SL: '#0288D1', // Light Blue for Slider
  SV: '#F57C00', // Deep Orange for Slurve
  FS: '#B71C1C', // Dark Red for Splitter
  ST: '#1E88E5', // Light Blue for Sweeper
};
export function getFullTeamName(abbreviation: string): string {
  switch (abbreviation) {
    case 'ARI':
      return 'Diamondbacks';
    case 'ATL':
      return 'Braves';
    case 'BAL':
      return 'Orioles';
    case 'BOS':
      return 'Red Sox';
    case 'CHC':
      return 'Cubs';
    case 'CHW':
    case 'CWS':
      return 'White Sox';
    case 'CIN':
      return 'Reds';
    case 'CLE':
      return 'Guardians';
    case 'COL':
      return 'Rockies';
    case 'DET':
      return 'Tigers';
    case 'FLA':
      return 'Marlins';
    case 'HOU':
      return 'Astros';
    case 'KAN':
      return 'Royals';
    case 'LAA':
      return 'Angels';
    case 'LAD':
      return 'Dodgers';
    case 'MIL':
      return 'Brewers';
    case 'MIN':
      return 'Twins';
    case 'NYM':
      return 'Mets';
    case 'NYY':
      return 'Yankees';
    case 'OAK':
      return 'Athletics';
    case 'PHI':
      return 'Phillies';
    case 'PIT':
      return 'Pirates';
    case 'SD':
      return 'Padres';
    case 'SF':
      return 'Giants';
    case 'SEA':
      return 'Mariners';
    case 'STL':
      return 'Cardinals';
    case 'TB':
      return 'Rays';
    case 'TEX':
      return 'Rangers';
    case 'TOR':
      return 'Blue Jays';
    case 'WAS':
      return 'Nationals';
    default:
      return 'Unknown Team';
  }
}

export const getPitchColor =  (abbreviation: string): string => {
  return pitchColorMap[abbreviation] || '#CCCCCC';
};
export const getPitchName = (abbreviation: string): string => {
  return pitchNameMap[abbreviation] || abbreviation;
};
export const getPitchNameMapArray = (pitchTypes: string[]): string[] => {
  return pitchTypes.map(pitchType => pitchNameMap[pitchType] || pitchType);
};
export interface CountScenario {
  [pitchType: string]: PitchData;
}

export interface PitchingStatistics {
  [count: string]: CountScenario;
}


export interface PitcherData {
    Age: string;
    BB: string;
    BB9: string;
    BF: string;
    BK: string;
    CG: string;
    ER: string;
    ERA: string;
    ERAPlus: string; 
    FIP: string;
    G: string;
    GF: string;
    GS: string;
    H: string;
    H9: string;
    HBP: string;
    HR: string;
    HR9: string;
    IBB: string;
    IP: string;
    L: string;
    Name: string;
    Pos: string;
    R: string;
    SHO: string;
    SO: string;
    SO9: string;
    SOW: string; 
    SV: string;
    W: string;
    WLPercentage: string; 
    WHIP: string;
    WP: string;
    Year: number;  
  }

export interface GetTeamIdsResponse {
    data: PitcherData[];
    pitcher_names: string[];
}
export interface RecentGame {
    at_bat_number: number;
    away_score: number;
    away_team: string;
    ax: number;
    ay: number;
    az: number;
    babip_value: number;
    balls: number;
    bat_score: number;
    bat_speed: number | null; 
    bb_type: string | null;
    break_angle_deprecated: number | null; 
    break_length_deprecated: number | null; 
    delta_home_win_exp: number;
    delta_run_exp: number;
    des: string;
    description: string;
    effective_speed: number;
    estimated_ba_using_speedangle: number | null; 
    estimated_woba_using_speedangle: number;
    events: string;
    [key: string]: any; 
  }
export interface RecentGamesResponse {
    [gamePk: string]: RecentGame[];
  }
