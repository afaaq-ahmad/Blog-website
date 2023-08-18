import styles from "./pageNotExistStyle.module.css";

const PageNotExist = () => {
  return (
    <div className={styles.flexContainer}>
      <div className={styles.message}>Page not exist :(</div>
    </div>
  );
};

export default PageNotExist;
