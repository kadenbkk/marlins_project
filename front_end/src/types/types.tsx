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
