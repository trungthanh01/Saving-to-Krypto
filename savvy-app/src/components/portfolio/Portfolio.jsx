import { useState, useEffect } from "react";
import { fetchCoinData } from "../../services/crypto-api.js";

export function Portfolio({holdings}){
    const [marketData, setMarketData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    setIsLoading()
    setMarketData()

    return
    




}