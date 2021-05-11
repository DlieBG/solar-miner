export interface Energy {
    bat_fuel: number,
    bat_power: number,
    solar_power: number,
    house_power: number,
    grid_power: number
}

export interface Profit {
    perkWh: number,
    perDay: number
}