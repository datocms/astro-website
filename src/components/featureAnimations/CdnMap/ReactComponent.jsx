import cn from 'classnames';
import Wrapper from '~/components/Wrapper/ReactComponent';
import { useCallback, useEffect, useState } from 'react';
import s from './style.module.css';
import ky from 'ky';

function convLatLongToStyle(latitude, longitude) {
  const x = (longitude + 180.0) * (100.0 / 360.0);
  const y = (latitude * -1.0 + 90.0) * (100.0 / 180.0);

  return { left: `${x}%`, top: `${y * (1 + (400 - 320) / 400)}%` };
}

const distance = (lat1, lon1, lat2, lon2, unit = 'K') => {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  }
  const radlat1 = (Math.PI * lat1) / 180;
  const radlat2 = (Math.PI * lat2) / 180;
  const theta = lon1 - lon2;
  const radtheta = (Math.PI * theta) / 180;
  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  if (unit === 'K') {
    dist = dist * 1.609344;
  }
  if (unit === 'N') {
    dist = dist * 0.8684;
  }
  return dist;
};

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const useData = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    setLoading(true);
    setError(null);

    ky(url, { signal })
      .json()
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      abortController.abort();
    };
  }, [url]);

  return { data, loading, error };
};

export default function CdnMapReactComponent({ children, datacenters }) {
  const [currentDataCenter, setCurrentDataCenter] = useState(null);
  const [ping, setPing] = useState(null);

  const { data: location } = useData('https://api-geolocation.zeit.sh/');

  const setAndScroll = useCallback(
    (code) => {
      setCurrentDataCenter(code);
      const el = document.getElementById(`datacenter-${code}`);

      if (el) {
        const rect = el.getBoundingClientRect();

        el.parentElement.parentElement.scroll({
          top: 0,
          left: el.offsetLeft - (window.innerWidth - rect.width) / 2,
          behavior: 'smooth',
        });
      }
    },
    [setCurrentDataCenter],
  );

  useEffect(() => {
    const abortController = new AbortController();

    async function run() {
      const start = new Date();

      const signal = abortController.signal;
      const data = await ky('https://graphql.datocms.com/geo/ping', { signal }).json();

      const end = new Date();
      setPing({ ...data, latency: Number.parseInt((end - start) * 0.8) });

      if (!currentDataCenter) {
        setAndScroll(data.datacenter.slice(0, 3).toUpperCase());
      }
    }

    run();

    return () => {
      abortController.abort();
    };
  }, [setPing, setAndScroll, currentDataCenter]);

  return (
    <div className={s.root}>
      <Wrapper>
        <div className={s.map}>
          {children}

          {location && (
            <div className={s.viewer} style={convLatLongToStyle(location.lat, location.lon)}>
              <div className={s.pin} />
              <div className={s.ripple} />
            </div>
          )}
          {datacenters.map((dc) => (
            <div
              key={dc.code}
              className={cn(s.datacenter, {
                [s.activePoint]: ping && ping.datacenter === dc.code,
              })}
              style={{
                ...convLatLongToStyle(dc.coordinates.latitude, dc.coordinates.longitude),
                zIndex: ping && ping.datacenter === dc.code ? 100 : 1,
              }}
              onClick={() => {
                setAndScroll(dc.code);
              }}
            >
              <div className={s.pin} />
            </div>
          ))}
        </div>
      </Wrapper>
      <div className={s.list}>
        <div className={s.listInner}>
          {datacenters.map((dc) => (
            <div key={dc.code} id={`datacenter-${dc.code}`} className={s.itemWrapper}>
              <div
                className={cn(s.item, {
                  [s.activeItem]: dc.code === (currentDataCenter || ping?.datacenter),
                  [s.nearestItem]: ping && ping.datacenter === dc.code,
                })}
                onClick={() => setAndScroll(dc.code)}
              >
                <div className={s.code}>{dc.code}</div>
                <div className={s.city}>
                  {dc.name.split(/ \- /)[0]}, {dc.billing_region}
                </div>
                <div className={s.infos}>
                  <div className={s.info}>
                    <div className={s.infoTitle}>Distance</div>
                    <div className={s.infoValue}>
                      {location && (
                        <>
                          {numberWithCommas(
                            Number.parseInt(
                              distance(
                                dc.coordinates.latitude,
                                dc.coordinates.longitude,
                                location.lat,
                                location.lon,
                              ),
                            ),
                          )}{' '}
                          km
                        </>
                      )}
                    </div>
                  </div>
                  {ping && ping.datacenter === dc.code && (
                    <div className={s.info}>
                      <div className={s.infoTitle}>Latency</div>
                      <div className={s.infoValue}>{numberWithCommas(ping.latency)} ms</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
