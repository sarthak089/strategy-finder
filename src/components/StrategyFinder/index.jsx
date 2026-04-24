import Modal from '../common/Modal'
import FilterBar from './FilterBar'
import ContextBar from './ContextBar'
import StrategyTable from './StrategyTable'
import useStrategies from '../../hooks/useStrategies'

export default function StrategyFinder({ onClose }) {
  const {
    filters,
    results,
    loading,
    error,
    expiries,
    meta,
    handleChange,
    handleReset,
    handleFind,
  } = useStrategies()

  return (
    <Modal title="Strategy Finder" onClose={onClose}>
      <FilterBar
        filters={filters}
        onChange={handleChange}
        onReset={handleReset}
        onFind={handleFind}
        loading={loading}
        expiries={expiries}
      />
      <ContextBar filters={filters} meta={meta} />
      <StrategyTable
        results={results}
        loading={loading}
        error={error}
      />
    </Modal>
  )
}

// import Modal from '../common/Modal'
// import FilterBar from './FilterBar'
// import ContextBar from './ContextBar'
// import StrategyTable from './StrategyTable'
// import useStrategies from '../../hooks/useStrategies'

// export default function StrategyFinder({ onClose }) {
//   const {
//     filters,
//     results,
//     loading,
//     error,
//     handleChange,
//     handleReset,
//     handleFind,
//   } = useStrategies()

//   return (
//     <Modal title="Strategy Finder" onClose={onClose}>
//       <FilterBar
//         filters={filters}
//         onChange={handleChange}
//         onReset={handleReset}
//         onFind={handleFind}
//         loading={loading}
//       />
//       <ContextBar filters={filters} />
//       <StrategyTable
//         results={results}
//         loading={loading}
//         error={error}
//       />
//     </Modal>
//   )
// }