import styles from "@/page.module.css";
import PWAInstallPrompt from "@/(anon)/_components/common/PWAInstallPrompt";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>전세보감</h1>
        <p className={styles.subtitle}>부동산 정보를 한눈에 확인하는 서비스</p>
        
        <div className={styles.grid}>
          <Link
            href="/test/post-code"
            className={styles.card}
          >
            <h2>우편번호 테스트</h2>
            <p>우편번호 검색 및 주소 입력 기능을 테스트합니다.</p>
          </Link>
          
          <Link
            href="/test/transaction"
            className={styles.card}
          >
            <h2>거래내역 테스트</h2>
            <p>부동산 거래내역 조회 기능을 테스트합니다.</p>
          </Link>
          
          <Link
            href="/test/tax-cert"
            className={styles.card}
          >
            <h2>납세확인서 테스트</h2>
            <p>납세확인서 발급 및 조회 기능을 테스트합니다.</p>
          </Link>
        </div>
      </main>
      <PWAInstallPrompt />
    </div>
  );
}
