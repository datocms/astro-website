import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import s from './style.module.css';
import worldMap from './world-110m.json';

/*
 * The world map. A country with partners takes the accent colour.
 * react-simple-maps builds the shapes after the mount, thus the page
 * hydrates this component.
 */
export default function PartnersMap({
  partnersCountByCountryCode,
  label,
}: {
  partnersCountByCountryCode: Record<string, number>;
  label: string;
}) {
  return (
    <div className={s.map} role="img" aria-label={label}>
      <ComposableMap
        projection="geoEquirectangular"
        width={960}
        height={400}
        projectionConfig={{ center: [0.5, 12] }}
      >
        <Geographies geography={worldMap}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const count = partnersCountByCountryCode[geo.properties.ISO_A2] || 0;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  className={count ? s.active : s.country}
                  tabIndex={-1}
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
