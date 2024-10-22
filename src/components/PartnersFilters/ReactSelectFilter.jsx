import ReactSelect from 'react-select';
import s from './style.module.css';

const ReactSelectFilter = ({ options, value, onChange, label, noFilterCounters }) => {
  return (
    <div>
      <div className={s.filterLabel}>{label}</div>
      <ReactSelect
        isClearable
        formatOptionLabel={(option) => `${option.value} (${noFilterCounters[option.value]})`}
        options={options}
        onChange={onChange}
        value={value ? options.find((o) => o.value === value) : null}
      />
    </div>
  );
};

export default ReactSelectFilter;
