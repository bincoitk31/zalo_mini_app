import React from "react";
import {Swiper} from "zmp-ui";
import { resizeLink } from "../utils/tools"
import settings from '../../app-settings.json'

const Carousel = () => {
  const SLIDERS = settings ?.sliders || []
  return (
    <Swiper autoplay duration={5000} loop>
      {
        SLIDERS.map((el, idx) => (
          <Swiper.Slide key={idx}>
            <img
              className="slide-img h-[200px] w-full object-cover"
              src={resizeLink(el.url)}
              alt={`slide-${idx}`}
            />
          </Swiper.Slide>
        ))
      }
  </Swiper>
  )
};

export default Carousel;