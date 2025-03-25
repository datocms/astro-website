import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import worldMap from './world-110m.json';
import Wrapper from '~/components/Wrapper/ReactComponent';
import s from './style.module.css';

export default function PartnersMap({
  partnersCountByCountryCode,
}: {
  partnersCountByCountryCode: Record<string, number>;
}) {
  return (
    <div className={s.root}>
      <Wrapper>
        <div className={s.map}>
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
                      fill={count ? `var(--azure-color)` : '#F5F4F6'}
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
      </Wrapper>
    </div>
  );
}
