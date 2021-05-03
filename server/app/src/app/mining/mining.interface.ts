import { NumberSymbol } from "@angular/common";

export interface Profit {
    perkWh: number,
    perDay: number
}

export interface Current {
    workers: Worker[],
    currentStats: CurrentStats,
    currentExchange: CurrentExchange
}

export interface Worker {
    worker: string,
    time: number,
    lastSeen: number,
    reportedHashrate: number,
    currentHashrate: number,
    validShares: number,
    invalidShares: number,
    staleShares: number
}

export interface CurrentStats {
    time: number,
    lastSeen: number,
    reportedHashrate: number,
    currentHashrate: number,
    validShares: number,
    invalidShares: number,
    staleShares: number,
    averageHashrate: number,
    activeWorkers: number,
    unpaid: number,
    unconfirmed: number,
    coinsPerMin: number,
    usdPerMin: number,
    btcPerMin: number
}

export interface CurrentExchange {
    BTC: number,
    USD: number,
    EUR: number
}