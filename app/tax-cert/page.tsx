import Navigation from "../../components/common/Navigation";
import TaxCertForm from "./TaxCertForm";
import styles from "./page.module.css";

export default function TaxCertPage() {
  return (
    <div className={styles.container}>
      <Navigation />

      <div className={styles.header}>
        <h1 className={styles.title}>📄 납세증명서 발급</h1>
        <p className={styles.subtitle}>
          다양한 인증 방식을 통해 납세증명서를 발급받을 수 있습니다
        </p>
      </div>

      <div className={styles.infoBox}>
        <h2 className={styles.infoTitle}>ℹ️ 납세증명서 발급 안내</h2>
        <div className={styles.infoList}>
          <p className={styles.infoItem}>
            • <strong>인증 방식:</strong> 아이디, 공동인증서, 금융인증서,
            간편인증 지원
          </p>
          <p className={styles.infoItem}>
            • <strong>추가인증:</strong> 금융인증서, 간편인증 로그인 시
            추가인증을 요구합니다
          </p>
          <p className={styles.infoItem}>
            • <strong>제한사항:</strong> 개인 발급 불가, 사업장이 있는 개인의
            경우 계속사업장만 발급 가능
          </p>
          <p className={styles.infoItem}>
            • <strong>주의사항:</strong> 과도한 API 호출 시 대상기관으로부터
            IP가 차단될 수 있습니다
          </p>
        </div>
      </div>

      <TaxCertForm />
    </div>
  );
}
