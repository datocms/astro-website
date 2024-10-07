import s from './style.module.css';

export default function WorkflowPermissions({ children }) {
  return (
    <div className={s.body}>
      <div className={s.title}>What Editors can do:</div>
      {children}
      <div className={s.button}>Save settings</div>
    </div>
  );
}
