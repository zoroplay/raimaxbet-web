"use client";
import React, { useEffect, useState } from "react";
import "./Fixtures.scss";
import { Fixture, Markets } from "@/_components";
import { sortArr } from "@/_utils/helpers";

interface FixturesProps {
  fixtureData: any;
  activeMarket: any;
  firstMarket: any;
  type: string;
}

const Fixtures = ({
  fixtureData,
  activeMarket,
  type,
  firstMarket,
}: FixturesProps) => {
  const [specifiers, setSpecifiers] = useState([]);
  //   const [specifiersSingle, setSpecifiersSingle] = useState([]);
  const [specifier, setSpecifier] = useState("");
  //   const [specifierSingle, setSpecifierSingle] = useState("");
  const [marketOutcomes, setMarketOutcomes] = useState([]);
  const [marketOutcomesSingle, setMarketOutcomesSingle] = useState([]);
  const [oddsChange, setOddsChange] = useState<any>(null);
  const [fixtures, setFixtures] = useState<{ [key in string]: string }[]>([]);

  // function to find specifiers
  const getSpecifiers = (active: any) => {
    const result: any = [];
    fixtureData &&
      fixtureData?.forEach((fixture: any) => {
        const outcomes = fixture?.outcomes;
        if (outcomes && outcomes.length > 0) {
          const filtered = outcomes.filter(
            (item: any) => item.marketID === parseInt(active.marketID)
          );

          filtered.forEach((outcome: any) => {
            let specifier = outcome.specifier;
            let found = result.find(
              (item: any) => item.specifier === specifier
            );
            if (!found)
              // check if specifier has been listed
              result.push({ specifier, value: specifier.split("=")[1] }); //push value to array
          });
        }
      });

    return result;
  };

  // set specifiers for multiple market selections
  useEffect(() => {
    if (
      activeMarket &&
      activeMarket.specifier &&
      activeMarket.specifier !== ""
    ) {
      const result = getSpecifiers(activeMarket);
      // update specifiers state
      setSpecifiers(result.sort((a: any, b: any) => a.value - b.value));
    }
    setFixtures(fixtureData);
    setMarketOutcomes(sortArr(activeMarket?.outcomes, "outcomeID"));
  }, [activeMarket, fixtureData]);

  // set specifiers for single market selections
  useEffect(() => {
    // if (firstMarket && firstMarket.specifier && firstMarket.specifier !== "") {
    //   const result = getSpecifiers(firstMarket);
    //   // update specifiers state
    //   setSpecifierSingle(result.sort((a: any, b: any) => a.value - b.value));
    // }
    setMarketOutcomesSingle(sortArr(firstMarket?.outcomes, "outcomeID"));
  }, [firstMarket, fixtureData]);

  return (
    <div className="fixtures">
      <Markets
        outcomes={marketOutcomes}
        outcomesSingle={marketOutcomesSingle}
        marketSpecifier={activeMarket?.specifier}
        activeSpecifier={specifier}
        specifiers={specifiers}
        changeSpecifier={(speci: string) => setSpecifier(speci)}
      />
      {fixtures?.map((fixture: any, idx: number) => (
        <div key={idx}>
          <Fixture
            data={fixture}
            market={activeMarket}
            marketSingle={firstMarket}
            specifiers={specifiers}
            specifier={specifier}
            type={type}
          />
        </div>
      ))}
    </div>
  );
};

export default Fixtures;
