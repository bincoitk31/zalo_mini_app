import React from "react";
import { Page, Swiper, Box, Text } from "zmp-ui";
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
              src={el.url}
              alt={`slide-${idx}`}
            />
          </Swiper.Slide>
        ))
      }
  </Swiper>
  )
};

export default Carousel;