import styles from "./loaderStyle.module.css";

const Loader = () => {
  return (
    <>
      <div className={styles.flexContainer}>
        <p>Loading...</p>
      </div>
    </>
  );
};

export default Loader;
