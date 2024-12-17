import { TechnicalSpecsProps } from '../types'
import { technicalSpecsCard } from './TechnicalSpecsCard.styles'

const specsDefault = [
  { label: 'Screen Size', details: '6.8 Inch' },
  { label: 'Operating System', details: 'Android 14' },
  { label: 'Rear Camera', details: '200 MP + 50 MP + 12 MP + 10 MP' },
  { label: 'Front Camera', details: '12 MP' },
  { label: 'Ram Size', details: '12GB' },
  { label: 'Battery', details: '5000mAh' },
]
export function TechnicalSpecsCard({
  title = 'Technical Specs',
  specs = specsDefault,
}: TechnicalSpecsProps) {
  return (
    <>
      <style>{technicalSpecsCard}</style>
      <section className={'techContainer'}>
        <div className={'techContentContainer'}>
          <h2 className={'techSectionTitle'}>{title}</h2>
          <table className={'detailsContainer table'}>
            <thead>
              <tr>
                <th className={'headerCell'}>Specification</th>
                <th className={'headerCell'}>Details</th>
              </tr>
            </thead>
            <tbody>
              {specs.map((spec, index) => (
                <tr key={index} className={'row'}>
                  <td className={'cell'}>{spec.label}</td>
                  <td className={'cell'}>
                    {Array.isArray(spec.details) ? (
                      <ul className={'list'}>
                        {spec.details.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      spec.details
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
