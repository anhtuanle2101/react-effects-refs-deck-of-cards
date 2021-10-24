import React, {useState, useEffect, useRef} from "react"
import axios from "axios";

const DeckOfCard = ()=>{
    const [cards, setCards] = useState([]);
    const [start, setStart] = useState(false);

    const deckId = useRef();
    const intervalId = useRef();

    useEffect(()=>{
        console.log("Fetching deck");
        const fetchDeck = async ()=>{
            const res = await axios.get(`http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`);
            deckId.current = res.data.deck_id;
        }
        fetchDeck();
    }, []);

    useEffect(()=>{
        const fetchCard = async ()=>{
            console.log("Fetching cards");
            
            intervalId.current = setInterval(async ()=>{
                const res = await axios.get(`http://deckofcardsapi.com/api/deck/${deckId.current}/draw/?count=1`);
                if (res.data.remaining===0){
                    clearInterval(intervalId.current);
                }else{
                    setCards(cards=>[...cards, res.data.cards[0]]); 
                }
                     
            },1000); 
        }
        if (deckId.current) fetchCard();
    }, [start]);

    const drawCard = ()=>{
        setStart(true);
    }

    return (
        <div className="DeckOfCard">
            {cards.length===52?<h1>Out Of Cards</h1>:<button onClick={drawCard}>Start Drawing</button>}
            {cards.map(card=>(<img src={card.image}></img>))}
        </div>
    )
}

export default DeckOfCard;