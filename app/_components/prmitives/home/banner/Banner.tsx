"use client";
import "./Banner.scss";
import Slider from "react-slick";
import Image from "next/image";
import { useAppDispatch } from "@/_hooks";
import { updateFixtures } from "@/_redux/slices/fixtures.slice";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useGetSlidesQuery } from "@/_services/sport.service";
import { useRouter } from "next/navigation";
import { GrPrevious, GrNext } from "react-icons/gr";
import { useRef } from "react";

const Banner = () => {
  const slider = useRef<Slider>(null);
  const settings = {
    arrows: false,
    autoplay: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const dispatch = useAppDispatch();

  const { data } = useGetSlidesQuery("");

  const router = useRouter();
  //   console.log(data, "slides")

  const handleLink = (link: string) => {
    if (!link) {
      return "";
    }

    if (link.includes("sports")) {
      const linkContentList = link.split("/");
      dispatch(
        updateFixtures({
          name: "top",
          info: [
            linkContentList[linkContentList.length - 2],
            linkContentList[linkContentList.length - 1],
          ],
        })
      );
    } else if (link.includes("fixture")) {
      const linkContentList = link.split("/");
      dispatch(
        updateFixtures({
          name: "single",
          info: [linkContentList[linkContentList.length - 1]],
        })
      );
    } else {
      router.push(link);
    }

    console.log(link, "l")
  };

  return (
    <div className="home_banner">
      <Slider ref={slider} {...settings} className="slide_container">
        {data &&
          data?.map((item: any, idx: number) => (
            <div
              className="slide"
              key={idx}
              style={{ cursor: item?.link ? "pointer" : "" }}
              onClick={() => {
                // item?.link && router.push(item?.link);
                handleLink(item?.link);
              }}
            >
              <Image
                src={item?.image_path}
                alt="bg"
                fill
                sizes="100vw"
                className="banner_image"
              />
            </div>
          ))}
      </Slider>
      <div
        className="banner_next center"
        onClick={() => slider?.current?.slickPrev()}
      >
        <GrNext />
      </div>
      <div
        className="banner_prev center"
        onClick={() => slider?.current?.slickNext()}
      >
        <GrPrevious />
      </div>
    </div>
  );
};

export default Banner;
