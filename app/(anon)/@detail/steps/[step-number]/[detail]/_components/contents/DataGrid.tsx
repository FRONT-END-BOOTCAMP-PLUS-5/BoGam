import styles from './DataGrid.styles';
import CircularIconBadge from '@/(anon)/_components/common/circularIconBadges/CircularIconBadge';

interface DataGridProps {
  data: Record<string, string>;
}

const DataGrid = ({ data }: DataGridProps) => {
  return (
    <div>
      {Object.entries(data).map(([key, value], index) => (
        <div key={index} className={styles.detailItem}>
          <div className={styles.detailKey}>
            {key}:
          </div>
          <div className={styles.detailValue}>
            <CircularIconBadge type={value as 'match' | 'mismatch' | 'unchecked'} size="xsm" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataGrid;
