import React from 'react'
import { AddonsCardProps } from '../types'
import { addonsCardStyles } from './AddonsCard.styles'

const addonsData = [
  {
    title: 'Perfect Match for Your Lifestyle',
    description: 'Samsung Galaxy Buds 3             Special price: ₹13,999.',
    image:
      'https://s3-alpha-sig.figma.com/img/ab42/6206/82019ff83168a1b6e82631f2a1439d40?Expires=1735516800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=C1ibSGupTGt3FONiZpwlxeYaJ68Lgc4QhP6raEEwY5A95MEO05T2u5niR0hRLz-n7QfY0qKcCFX2EqxCOhi3wnmlNSbTNIUf6PUJ0~L6HILG0ILfrKGp2SEDhA9EYaoWrkirs3ysWvqwMcX3-pRp8-dOZizb~9igluFEntHT4N3hob5cPp2S3WFCYd9C8UWCUtkftd2jflHBAGM57KRGayQDRli~EB~N7UIcos0oMSxjIXb2wRwjZI5pU6n93hbYli3DOdRNuNJ4b0vEkuF7IxAr7Wm8Ozcb8E~jy2-PyV~rveG~5-UGugjjNaV5XsZuQBdHMf9s1bTcCqXXf1B70A__',
  },
  {
    title: 'Keep Your Memories Safe',
    description:
      'GCloud+ 2TB: ₹99/month – never lose a memory! Backup made easy with Apple’s seamless ecosystem.',
    image:
      'https://s3-alpha-sig.figma.com/img/2fc1/2ec0/c3776ddcbc0346cb5a875a25ce8f3dfb?Expires=1735516800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=EfN0Mfbw9T~s4-x7ThphvYgZ9tTW20i22jZe2wJbohkwTb5iS3DI7URd93SbUFali5zAdCYzHIetrKhc38xJENhTp0Gi8g07zhwIsoeUHp4g~bG3PInPXZggs~kqHeGEA8XVuRpAVtuXOUoD7NOeU3zIg1n56pFkO4SgzXuF02SedxjjWxbQJ5xB5MXReOSDRx6zO0SKUcrwD3eV2qrlroVB0bgMXFcwg4OvZiiauarR0k6bc9XwDFx6NMGciDogVZLgmuSc9-54EqB4qJ9A3U2aowojoFRI87qoV1dBQEUdNHQIHLNOYSHpX6enuhtJGYd2CR36WQ-HmXO1VIEekw__',
  },
  {
    title: 'Trade-In Made Simple',
    description:
      'Exchange your current device for an additional discount of up to ₹15,000! Let us take care of the process.',
    image:
      'https://s3-alpha-sig.figma.com/img/ace4/0687/c43be08e29bf3d28fc406dee200ed17b?Expires=1735516800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=MZ0Czl8KOtMl1C74zNlAyiS7lBQqOlp6pWYFy5ti1YBy4p8lz~A745GTaFHGNb3GgrJnenOXGDlmwlrsjUsUxSv1FQ1iCvrgr1W-eeiQqFS3MaFcG6rgmHGr~yFRu8ziTHDVi69q7q~W0-oZoWiCvjW7w-KUjcFWE1kUIf0Dw2Xxlj8iFT~OBzE9NzYhu8g-Ir0GH3shxRdMycl-OqFP-kxD0ZfB81i1eqQt~egZ9kCXrEwL7S70D359-NrR7~NT7WHt2YLy4~1KCi3dn9zBRD8M6PXO9t5lGapEfpiw51L-v0bKvffvNTHlKP~15uIPcJDzDZmKN5w~jSWFwYlaww__',
  },
]

export function AddonsCard({
  title = 'Recommended Addons for Samsumg Galaxy S24 Pro',
  addons = addonsData,
}: AddonsCardProps) {
  return (
    <>
      <style>{addonsCardStyles}</style>
      <section className="addonsSection">
        <div className="contentsContainer">
          <h2 className="addonsSectionTitle">{title}</h2>
          <div>
            <div className="subContainer">
              {addons.map((addon, index) => (
                <div key={index} className="card">
                  {addon.image && <img src={addon.image} alt={addon.title} className="cardImage" />}
                  <h3 className="cardTitle">{addon.title}</h3>
                  <p className="cardDescription">{addon.description}</p>
                  <button className="addToCartButton">{addon.buttonText || 'Add to Cart'}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
