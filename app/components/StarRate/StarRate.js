import React from "react";
import style from "./StarRate.module.css";

export const StarRate = () => {
  return (
    <div className={style.rate}>
      <input type="radio" id="star5" name="rate" value="5" />
      <label for="star5">5 stars</label>
      <input type="radio" id="star4" name="rate" value="4" />
      <label for="star4">4 stars</label>
      <input type="radio" id="star3" name="rate" value="3" />
      <label for="star3">3 stars</label>
      <input type="radio" id="star2" name="rate" value="2" />
      <label for="star2">2 stars</label>
      <input type="radio" id="star1" name="rate" value="1" />
      <label for="star1">1 star</label>
    </div>
  );
};
