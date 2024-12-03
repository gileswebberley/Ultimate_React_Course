import styles from './Button.module.css';
//contains the 'type' related class names of primary/back/position

function Button({ children, onClick, type }) {
  //type is a string that corresponds to a css class name in the attached module which we access with [] rather than dot notation
  return (
    <button onClick={onClick} className={`${styles.btn} ${styles[type]}`}>
      {children}
    </button>
  );
}

export default Button;
