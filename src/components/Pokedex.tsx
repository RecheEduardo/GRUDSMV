import { useState } from "react";
import "./Pokedex.css";
import usePokedex from "../hooks/usePokedex";
import PokeCard from "./PokeCard";

export default function Pokedex() {
  const [nome, setNome] = useState("");
  const [termoBusca, setTermoBusca] = useState("");

  const { data, error, loading } = usePokedex(termoBusca);

  return (
    <div className="pokedex-container">
      <h2 className="pokedex-title">🔎 Pokédex</h2>

      <input
        className="pokedex-input"
        type="text"
        placeholder="Digite o nome do Pokémon"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <button className="pokedex-button" onClick={() => setTermoBusca(nome)}>
        Buscar
      </button>

      {loading && <p className="pokedex-loading">Carregando...</p>}
      {error && <p className="pokedex-error">{error}</p>}

      {data  && (
        <PokeCard pokemon={data} />
      )}
    </div>
  );
}