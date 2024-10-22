import React, { useState } from 'react';
import ReactSelectFilter from './ReactSelectFilter';
import { uniq } from 'lodash-es';

const toOption = (entry) => ({
  value: entry[0],
  label: entry[0],
});

const byCount = (entryA, entryB) => {
  if (entryA[1] !== entryB[1]) {
    return entryB[1] - entryA[1];
  }
  return entryA[0].localeCompare(entryB[0]);
};

const calculateCounters = (agencies, continent, country) => {
  const allTechnologies = {};
  const allAreaOfExpertise = {};
  const allCountries = {};
  const allContinents = {};

  for (const p of agencies) {
    for (const t of p.technologies) {
      allTechnologies[t.name] = (allTechnologies[t.name] || 0) + 1;
    }
    for (const t of p.areasOfExpertise) {
      allAreaOfExpertise[t.name] = (allAreaOfExpertise[t.name] || 0) + 1;
    }
    for (const t of p.locations) {
      if (!continent || t.continent.name === continent)
        allCountries[`${t.emoji} ${t.name}`] = (allCountries[`${t.emoji} ${t.name}`] || 0) + 1;
    }
    for (const continentName of uniq(p.locations.map((t) => t.continent.name))) {
      allContinents[continentName] = (allContinents[continentName] || 0) + 1;
    }
  }

  return {
    technologies: allTechnologies,
    areaOfExpertise: allAreaOfExpertise,
    countries: allCountries,
    continents: allContinents,
  };
};

const PartnersFilters = ({ ordered, onFilteredResults }) => {
  const [technologyFilter, setTechnologyFilter] = useState(null);
  const [areaOfExpertiseFilter, setAreaOfExpertiseFilter] = useState(null);
  const [countryFilter, setCountryFilter] = useState(null);
  const [continentFilter, setContinentFilter] = useState(null);

  const filtered = ordered.filter((p) => {
    if (technologyFilter && !p.technologies.some((t) => t.name === technologyFilter)) {
      return false;
    }
    if (
      areaOfExpertiseFilter &&
      !p.areasOfExpertise.some((t) => t.name === areaOfExpertiseFilter)
    ) {
      return false;
    }
    if (countryFilter && !p.locations.some((t) => `${t.emoji} ${t.name}` === countryFilter)) {
      return false;
    }
    if (continentFilter && !p.locations.some((t) => t.continent.name === continentFilter)) {
      return false;
    }

    return true;
  });

  const filteredCounters = calculateCounters(filtered, continentFilter);
  const noFilterCounters = calculateCounters(ordered, continentFilter);

  const continentOptions = Object.entries(filteredCounters.continents).sort(byCount).map(toOption);

  const countryOptions = Object.entries(filteredCounters.countries).sort(byCount).map(toOption);

  const technologyOptions = Object.entries(filteredCounters.technologies)
    .sort(byCount)
    .map(toOption);

  const areaOfExpertiseOptions = Object.entries(filteredCounters.areaOfExpertise)
    .sort(byCount)
    .map(toOption);

  React.useEffect(() => {
    onFilteredResults(filtered);
  }, [filtered]);

  return (
    <div className="filterGrid">
      <ReactSelectFilter
        label="Filter by Continent"
        options={continentOptions}
        value={continentFilter}
        onChange={(option) => {
          setContinentFilter(option ? option.value : null);
          setCountryFilter(null);
        }}
        noFilterCounters={noFilterCounters.continents}
      />

      <ReactSelectFilter
        label="Filter by Country"
        options={countryOptions}
        value={countryFilter}
        onChange={(option) => setCountryFilter(option ? option.value : null)}
        noFilterCounters={noFilterCounters.countries}
      />

      <ReactSelectFilter
        label="Filter by Technology"
        options={technologyOptions}
        value={technologyFilter}
        onChange={(option) => setTechnologyFilter(option ? option.value : null)}
        noFilterCounters={filteredCounters.technologies}
      />

      <ReactSelectFilter
        label="Filter by Area of Expertise"
        options={areaOfExpertiseOptions}
        value={areaOfExpertiseFilter}
        onChange={(option) => setAreaOfExpertiseFilter(option ? option.value : null)}
        noFilterCounters={filteredCounters.areaOfExpertise}
      />
    </div>
  );
};

export default PartnersFilters;
