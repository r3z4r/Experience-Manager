import { ProductCardProps } from '../types'
import { productCardStyles } from './ProductCard.styles'

export function ProductCard({
  imageSrc = 'https://s3-alpha-sig.figma.com/img/2acc/41d0/6ad664d06de647b3f5bfd8f0bd9adec2?Expires=1735516800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=NB4yPsHq7XWb1kkEU91joT2ssnLCBUK2h2SxBSxqqdOt1EGOpHRFBW1YG8HQWdzHKCJrAbTrKpkRQEDdJuBqKlwZWm62dv8bRDZcxCfDIqToLH1VX5RgLSNbxzyN6G5YLlHwnLs5qMk8yQIzZhKTA5WBxh0f3stzvrnDob50Lm2KsWtCf-rndOmhCFAHzd9fekhBFjKknA7PgMMwBRY2RTV4RZH69cjygiO5i7cUbU3shevmF~3~L6nB4VyMorFZ3ltAteYGvwJdPggj4YVggmFFuXVk0Hqi4menbOHRD~ioTt206K243JKJZvQCp8Zopa61Ar~xTuEPIWzKo1OA0A__',
  name = 'iPhone 14',
  price = '2,760 SR',
  onClick,
}: ProductCardProps) {
  return (
    <>
      <style>{productCardStyles}</style>
      <div className="productCard">
        <h3 className="cardBrand">Apple</h3>
        <p className="cardName">{name}</p>
        <p className="cardPrice">from {price}</p>
        <img className="cardImage" src={imageSrc} alt={name} />
      </div>
    </>
  )
}
