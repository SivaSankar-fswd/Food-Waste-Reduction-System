import biryani from "../assets/foods/biryani.jpg";
import idli from "../assets/foods/idli.jpg";
import parotta from "../assets/foods/parotta.jpg";
import rice from "../assets/foods/rice.jpg";
import meals from "../assets/foods/meals.jpg";
import chapathi from "../assets/foods/chapathi.jpg";
import poori from "../assets/foods/poori.jpg";
import pongal from "../assets/foods/pongal.jpg";
import chickenfriedrice from "../assets/foods/chickenfriedrice.jpg";
import dosai from "../assets/foods/dosa.jpg";
import def from "../assets/foods/default.jpg";

export const getFoodImage = (name) => {
  if (!name) return def;

  name = name.toLowerCase();

  if (name.includes("chicken friedrice")  || name.includes("friedrice")) return chickenfriedrice;
   if (name.includes("dosa")  || name.includes("dosai")) return dosai;
  if (name.includes("biryani") || name.includes("biriyani")) return biryani;
  if (name.includes("idli")) return idli;
  if (name.includes("parotta") || name.includes("porata")) return parotta;
  if (name.includes("rice")) return rice;
  if (name.includes("meal")) return meals;
  if (name.includes("chapathi")) return chapathi;
  if (name.includes("poori")) return poori;
  if (name.includes("pongal")) return pongal;
  

  return def;
};
