import styles from './DataGrid.styles';
import CircularIconBadge from '@/(anon)/_components/common/circularIconBadges/CircularIconBadge';

interface DataGridProps {
  data: Array<{ left: string; right?: string }>;
}

const DataGrid = ({ data }: DataGridProps) => {
  return (
    <div>
      {data.map((item, index) => (
        <div key={index} className={styles.detailItem}>
          <div className={styles.detailKey}>{item.left}:</div>
          <div className={styles.detailValue}>
            <CircularIconBadge
              type={item.right as 'match' | 'mismatch' | 'unchecked'}
              size='xsm'
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataGrid;
