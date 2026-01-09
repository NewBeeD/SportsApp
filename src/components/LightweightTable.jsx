import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import '../css/LightweightTable.css';

/**
 * Lightweight HTML-based table component as a MUI Table replacement
 * Reduces bundle size by ~30-50KB compared to MUI Table component
 * 
 * @param {Array} headers - Column headers: [{label: 'Name', align: 'left'}]
 * @param {Array} rows - Table rows with data
 * @param {Function} onRowClick - Optional callback for row clicks
 * @param {string} className - Additional CSS classes
 */
export const LightweightTable = ({ headers, rows, onRowClick, className = '', variant = 'default' }) => {
  return (
    <Box className={`lightweight-table-wrapper ${className}`} sx={{ overflowX: 'auto', marginY: 2 }}>
      <table className={`lightweight-table ${variant}`}>
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th 
                key={idx} 
                style={{ 
                  textAlign: header.align || 'left',
                  fontWeight: header.fontWeight || 900,
                  fontSize: header.fontSize || '12px'
                }}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows && rows.map((row, rowIdx) => (
            <tr 
              key={rowIdx}
              onClick={() => onRowClick && onRowClick(row)}
              className={onRowClick ? 'clickable' : ''}
            >
              {row.cells.map((cell, cellIdx) => (
                <td 
                  key={cellIdx}
                  style={{ 
                    textAlign: headers[cellIdx]?.align || 'left',
                    fontSize: headers[cellIdx]?.fontSize || '13px'
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
};

LightweightTable.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    align: PropTypes.string,
    fontWeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    fontSize: PropTypes.string
  })).isRequired,
  rows: PropTypes.arrayOf(PropTypes.shape({
    cells: PropTypes.array.isRequired
  })),
  onRowClick: PropTypes.func,
  className: PropTypes.string,
  variant: PropTypes.string
};

LightweightTable.defaultProps = {
  rows: [],
  onRowClick: null,
  className: '',
  variant: 'default'
};

export default LightweightTable;
