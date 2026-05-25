import { useContext, useState, useEffect, useCallback, useRef } from 'react';
import UseContext from '../Context';
import Draggable from 'react-draggable';
import '../css/Solitaire.css';


// ── CARD CONSTANTS ──────────────────────────────────────────
const SUITS = ['♠','♥','♦','♣'];
const RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const RED   = new Set(['♥','♦']);

function isRed(suit) { return RED.has(suit); }

function buildDeck() {
  const deck = [];
  for (const suit of SUITS)
    for (const rank of RANKS)
      deck.push({ suit, rank, faceUp: false, id: `${rank}${suit}` });
  return deck;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function rankIndex(rank) { return RANKS.indexOf(rank); }

function canStack(card, onto) {
  // onto is the top card of a tableau column
  if (!onto) return card.rank === 'K';
  return isRed(card.suit) !== isRed(onto.suit) &&
         rankIndex(card.rank) === rankIndex(onto.rank) - 1;
}

function canFoundation(card, topCard, suit) {
  if (card.suit !== suit) return false;
  if (!topCard) return card.rank === 'A';
  return rankIndex(card.rank) === rankIndex(topCard.rank) + 1;
}

function dealGame() {
  const deck = shuffle(buildDeck());
  const tableau = Array.from({ length: 7 }, () => []);
  let idx = 0;
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      const card = { ...deck[idx++] };
      card.faceUp = row === col;
      tableau[col].push(card);
    }
  }
  const stock = deck.slice(idx).map(c => ({ ...c, faceUp: false }));
  const waste  = [];
  const foundations = { '♠': [], '♥': [], '♦': [], '♣': [] };
  return { tableau, stock, waste, foundations };
}

// ── CARD COMPONENT ──────────────────────────────────────────
function Card({ card, small, selected, onClick, onDoubleClick }) {
  const red = isRed(card.suit);
  if (!card.faceUp) {
    return (
      <div
        className={`sol-card sol-card-back${small ? ' small' : ''}`}
        onClick={onClick}
      />
    );
  }
  return (
    <div
      className={`sol-card${small ? ' small' : ''}${selected ? ' selected' : ''}${red ? ' red' : ''}`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <span className="sol-rank-top">{card.rank}</span>
      <span className="sol-suit-top">{card.suit}</span>
      <span className="sol-suit-center">{card.suit}</span>
      <span className="sol-rank-bot">{card.rank}</span>
      <span className="sol-suit-bot">{card.suit}</span>
    </div>
  );
}

// ── MAIN COMPONENT ──────────────────────────────────────────
export default function Solitaire({ show, setShow }) {
  const { themeDragBar } = useContext(UseContext);
  const [expand, setExpand]   = useState(false);
  const [focus, setFocus]     = useState(true);
  const [game, setGame]       = useState(() => dealGame());
  const [selected, setSelected] = useState(null); // { from, colIdx, cardIdx }
  const [score, setScore]     = useState(0);
  const [moves, setMoves]     = useState(0);
  const [won, setWon]         = useState(false);
  const [drawCount] = useState(1); // draw 1

  const addScore = useCallback((pts) => setScore(s => Math.max(0, s + pts)), []);

  // ── CHECK WIN ───────────────────────────────────────────
  useEffect(() => {
    const total = Object.values(game.foundations).reduce((s, f) => s + f.length, 0);
    if (total === 52) setWon(true);
  }, [game.foundations]);

  // ── NEW GAME ────────────────────────────────────────────
  function newGame() {
    setGame(dealGame());
    setSelected(null);
    setScore(0);
    setMoves(0);
    setWon(false);
  }

  // ── DRAW FROM STOCK ─────────────────────────────────────
  function drawStock() {
    setGame(prev => {
      const g = deepClone(prev);
      if (g.stock.length === 0) {
        // reset stock from waste
        g.stock = g.waste.reverse().map(c => ({ ...c, faceUp: false }));
        g.waste = [];
        addScore(-100);
      } else {
        for (let i = 0; i < drawCount && g.stock.length > 0; i++) {
          const card = g.stock.pop();
          card.faceUp = true;
          g.waste.push(card);
        }
      }
      return g;
    });
    setSelected(null);
    setMoves(m => m + 1);
  }

  // ── DEEP CLONE ──────────────────────────────────────────
  function deepClone(g) {
    return {
      tableau:     g.tableau.map(col => col.map(c => ({ ...c }))),
      stock:       g.stock.map(c => ({ ...c })),
      waste:       g.waste.map(c => ({ ...c })),
      foundations: {
        '♠': [...g.foundations['♠']],
        '♥': [...g.foundations['♥']],
        '♦': [...g.foundations['♦']],
        '♣': [...g.foundations['♣']],
      }
    };
  }

  // ── TRY MOVE TO FOUNDATION ──────────────────────────────
  function tryFoundation(card, from, fromIdx) {
    const suit = card.suit;
    const top  = game.foundations[suit];
    if (!canFoundation(card, top[top.length - 1], suit)) return false;

    setGame(prev => {
      const g = deepClone(prev);
      g.foundations[suit].push(card);

      if (from === 'waste') {
        g.waste.pop();
      } else if (from === 'tableau') {
        g.tableau[fromIdx].pop();
        const col = g.tableau[fromIdx];
        if (col.length > 0) col[col.length - 1].faceUp = true;
      }
      return g;
    });
    addScore(10);
    setMoves(m => m + 1);
    setSelected(null);
    return true;
  }

  // ── CLICK WASTE ─────────────────────────────────────────
  function clickWaste() {
    const card = game.waste[game.waste.length - 1];
    if (!card) return;

    if (selected) {
      setSelected(null);
      return;
    }
    setSelected({ from: 'waste', card, colIdx: -1, cardIdx: -1 });
  }

  // ── CLICK FOUNDATION ────────────────────────────────────
  function clickFoundation(suit) {
    if (!selected) return;
    const { from, card, colIdx, cardIdx } = selected;

    // only single cards go to foundation
    if (from === 'tableau') {
      const col = game.tableau[colIdx];
      if (cardIdx !== col.length - 1) { setSelected(null); return; }
    }

    tryFoundation(card, from, colIdx);
  }

  // ── CLICK TABLEAU ───────────────────────────────────────
  function clickTableau(colIdx, cardIdx) {
    const col  = game.tableau[colIdx];
    const card = col[cardIdx];

    // Flip face-down card
    if (!card.faceUp) {
      if (cardIdx === col.length - 1) {
        setGame(prev => {
          const g = deepClone(prev);
          g.tableau[colIdx][cardIdx].faceUp = true;
          return g;
        });
        addScore(5);
        setMoves(m => m + 1);
      }
      setSelected(null);
      return;
    }

    // If nothing selected — select this card
    if (!selected) {
      setSelected({ from: 'tableau', card, colIdx, cardIdx });
      return;
    }

    // Something already selected — try to move onto this column
    const { from, card: selCard, colIdx: selCol, cardIdx: selIdx } = selected;
    const topCard = col[col.length - 1];

    if (canStack(selCard, topCard)) {
      setGame(prev => {
        const g = deepClone(prev);
        let moving = [];

        if (from === 'waste') {
          moving = [g.waste.pop()];
        } else {
          moving = g.tableau[selCol].splice(selIdx);
          const src = g.tableau[selCol];
          if (src.length > 0) src[src.length - 1].faceUp = true;
        }
        g.tableau[colIdx].push(...moving);
        return g;
      });
      addScore(5);
      setMoves(m => m + 1);
      setSelected(null);
    } else {
      // reselect clicked card
      setSelected({ from: 'tableau', card, colIdx, cardIdx });
    }
  }

  // ── DOUBLE CLICK — auto to foundation ───────────────────
  function dblClickTableau(colIdx, cardIdx) {
    const col  = game.tableau[colIdx];
    if (cardIdx !== col.length - 1) return;
    const card = col[cardIdx];
    if (!card.faceUp) return;
    tryFoundation(card, 'tableau', colIdx);
  }

  function dblClickWaste() {
    const card = game.waste[game.waste.length - 1];
    if (!card) return;
    tryFoundation(card, 'waste', -1);
  }

  // ── CLICK EMPTY TABLEAU (drop king) ─────────────────────
  function clickEmptyTableau(colIdx) {
    if (!selected) return;
    if (selected.card.rank !== 'K') { setSelected(null); return; }

    const { from, card: selCard, colIdx: selCol, cardIdx: selIdx } = selected;
    setGame(prev => {
      const g = deepClone(prev);
      let moving = [];
      if (from === 'waste') {
        moving = [g.waste.pop()];
      } else {
        moving = g.tableau[selCol].splice(selIdx);
        const src = g.tableau[selCol];
        if (src.length > 0) src[src.length - 1].faceUp = true;
      }
      g.tableau[colIdx].push(...moving);
      return g;
    });
    addScore(5);
    setMoves(m => m + 1);
    setSelected(null);
  }

  if (!show) return null;

  const { tableau, stock, waste, foundations } = game;
  const wasteTop = waste[waste.length - 1];

  return (
    <Draggable
      handle=".sol-dragbar"
      grid={[1,1]}
      disabled={expand}
      bounds={{ top: 0 }}
      defaultPosition={{ x: 120, y: 40 }}
      onStart={() => setFocus(true)}
    >
      <div
        className="sol-window"
        style={expand ? {
          position: 'fixed', left: 0, top: 0,
          width: '100%', height: 'calc(100vh - 37px)',
          zIndex: 9999, resize: 'none',
        } : { zIndex: 9999 }}
        onClick={() => setFocus(true)}
      >
        {/* TITLE BAR */}
        <div className="sol-dragbar" style={{ background: focus ? themeDragBar : '#757579' }}>
          <div className="sol-barname">
            <span>♠</span>
            <span>Solitaire</span>
          </div>
          <div className="sol-barbtn">
            <div className="sol-btn" onClick={() => setShow(false)}><span className="sol-dash"/></div>
            <div className="sol-btn" onClick={() => setExpand(e => !e)}><span className={`sol-expand${expand?' full':''}`}/></div>
            <div className="sol-btn" onClick={() => setShow(false)}><span className="sol-x">×</span></div>
          </div>
        </div>

        {/* MENU */}
        <div className="sol-menubar">
          <span onClick={newGame}>Game</span>
          <span>Help</span>
          <span className="sol-score">Score: {score} &nbsp;|&nbsp; Moves: {moves}</span>
        </div>

        {/* WIN BANNER */}
        {won && (
          <div className="sol-win">
            🎉 You Win! &nbsp;
            <button onClick={newGame}>New Game</button>
          </div>
        )}

        {/* GAME AREA */}
        <div className="sol-area" onClick={() => setSelected(null)}>

          {/* TOP ROW: stock, waste, foundations */}
          <div className="sol-top-row">
            {/* Stock */}
            <div
              className={`sol-card${stock.length === 0 ? ' sol-card-empty' : ' sol-card-back'}`}
              onClick={(e) => { e.stopPropagation(); drawStock(); }}
              title="Draw"
            >
              {stock.length === 0 && <span style={{fontSize:'18px',color:'#aaa'}}>↺</span>}
            </div>

            {/* Waste */}
            <div
              className={`sol-card${!wasteTop ? ' sol-card-empty' : ''}`}
              onClick={(e) => { e.stopPropagation(); clickWaste(); }}
              onDoubleClick={(e) => { e.stopPropagation(); dblClickWaste(); }}
            >
              {wasteTop && (
                <Card
                  card={wasteTop}
                  selected={selected?.from === 'waste'}
                  onClick={() => {}}
                  onDoubleClick={() => {}}
                />
              )}
            </div>

            <div className="sol-spacer" />

            {/* Foundations */}
            {SUITS.map(suit => {
              const top = foundations[suit];
              const topCard = top[top.length - 1];
              return (
                <div
                  key={suit}
                  className={`sol-foundation${isRed(suit) ? ' red' : ''}`}
                  onClick={(e) => { e.stopPropagation(); clickFoundation(suit); }}
                  title={suit}
                >
                  {topCard
                    ? <Card card={topCard} onClick={() => {}} onDoubleClick={() => {}} />
                    : <span className="sol-suit-ghost">{suit}</span>
                  }
                </div>
              );
            })}
          </div>

          {/* TABLEAU */}
          <div className="sol-tableau">
            {tableau.map((col, colIdx) => (
              <div
                key={colIdx}
                className="sol-column"
                onClick={(e) => { e.stopPropagation(); if (col.length === 0) clickEmptyTableau(colIdx); }}
              >
                {col.length === 0 && (
                  <div className="sol-card sol-card-empty" />
                )}
                {col.map((card, cardIdx) => (
                  <div
                    key={card.id}
                    className="sol-stack-card"
                    style={{ top: `${cardIdx * 20}px` }}
                    onClick={(e) => { e.stopPropagation(); clickTableau(colIdx, cardIdx); }}
                    onDoubleClick={(e) => { e.stopPropagation(); dblClickTableau(colIdx, cardIdx); }}
                  >
                    <Card
                      card={card}
                      selected={
                        selected?.from === 'tableau' &&
                        selected.colIdx === colIdx &&
                        cardIdx >= selected.cardIdx
                      }
                      onClick={() => {}}
                      onDoubleClick={() => {}}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Draggable>
  );
}