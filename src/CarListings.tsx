import { useState, type FormEvent } from 'react'
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Fuel,
  Gauge,
  Heart,
  LayoutGrid,
  List,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react'
import './marketplace.css'

type Car = {
  id: number
  year: number
  make: string
  model: string
  trim: string
  price: number
  mileage: number
  body: string
  transmission: string
  fuel: string
  location: string
  image: string
  label?: string
}

const cars: Car[] = [
  {
    id: 1,
    year: 1991,
    make: 'Porsche',
    model: '911 Carrera',
    trim: '964 - Guards Red',
    price: 76900,
    mileage: 44800,
    body: 'Coupe',
    transmission: 'Manual',
    fuel: 'Gasoline',
    location: 'Portland, OR',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
    label: 'Just in',
  },
  {
    id: 2,
    year: 2021,
    make: 'BMW',
    model: 'M3 Competition',
    trim: 'Brooklyn Grey - Carbon pack',
    price: 68400,
    mileage: 18300,
    body: 'Sedan',
    transmission: 'Automatic',
    fuel: 'Gasoline',
    location: 'Seattle, WA',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=85',
    label: 'Low miles',
  },
  {
    id: 3,
    year: 1994,
    make: 'Land Rover',
    model: 'Defender 90',
    trim: 'NAS - Alpine White',
    price: 82900,
    mileage: 69200,
    body: 'SUV',
    transmission: 'Manual',
    fuel: 'Gasoline',
    location: 'Bend, OR',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85',
    label: 'Rare find',
  },
  {
    id: 4,
    year: 1972,
    make: 'Volvo',
    model: 'P1800 ES',
    trim: 'Shooting brake - restored',
    price: 42900,
    mileage: 51800,
    body: 'Coupe',
    transmission: 'Manual',
    fuel: 'Gasoline',
    location: 'Boise, ID',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 5,
    year: 2018,
    make: 'Porsche',
    model: '718 Cayman GTS',
    trim: 'Chalk - Sport Chrono',
    price: 71900,
    mileage: 26700,
    body: 'Coupe',
    transmission: 'Automatic',
    fuel: 'Gasoline',
    location: 'San Francisco, CA',
    image: 'https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 6,
    year: 2022,
    make: 'Ford',
    model: 'Bronco Badlands',
    trim: '2-door - Sasquatch package',
    price: 51200,
    mileage: 9400,
    body: 'SUV',
    transmission: 'Automatic',
    fuel: 'Gasoline',
    location: 'Denver, CO',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85',
    label: 'Low miles',
  },
  {
    id: 7,
    year: 1967,
    make: 'Mercedes-Benz',
    model: '230 SL',
    trim: 'Pagoda - Signal Red',
    price: 96500,
    mileage: 73800,
    body: 'Convertible',
    transmission: 'Automatic',
    fuel: 'Gasoline',
    location: 'Los Angeles, CA',
    image: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=85',
    label: 'New price',
  },
  {
    id: 8,
    year: 1998,
    make: 'Toyota',
    model: 'Land Cruiser',
    trim: 'FZJ80 - Collector owned',
    price: 38900,
    mileage: 112000,
    body: 'SUV',
    transmission: 'Automatic',
    fuel: 'Gasoline',
    location: 'Salt Lake City, UT',
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=85',
  },
]

const featuredCar = cars[0]
const money = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
const mileage = (amount: number) => new Intl.NumberFormat('en-US').format(amount)

function App() {
  const [query, setQuery] = useState('')
  const [make, setMake] = useState('Any make')
  const [body, setBody] = useState('Any body')
  const [yearRange, setYearRange] = useState('Any year')
  const [priceCap, setPriceCap] = useState('Any price')
  const [sort, setSort] = useState('Recently added')
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const [savedOnly, setSavedOnly] = useState(false)
  const [saved, setSaved] = useState<number[]>([])
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)
  const [sent, setSent] = useState(false)

  let visibleCars = cars.filter((car) => {
    const matchesQuery = `${car.make} ${car.model} ${car.trim} ${car.year}`.toLowerCase().includes(query.toLowerCase())
    const matchesMake = make === 'Any make' || car.make === make
    const matchesBody = body === 'Any body' || car.body === body
    const matchesYear = yearRange === 'Any year' ||
      (yearRange === 'Before 1990' && car.year < 1990) ||
      (yearRange === '1990s' && car.year >= 1990 && car.year < 2000) ||
      (yearRange === '2000s' && car.year >= 2000 && car.year < 2010) ||
      (yearRange === '2010+' && car.year >= 2010)
    const matchesPrice = priceCap === 'Any price' || car.price <= Number(priceCap)
    const matchesSaved = !savedOnly || saved.includes(car.id)
    return matchesQuery && matchesMake && matchesBody && matchesYear && matchesPrice && matchesSaved
  })

  if (sort === 'Price: low to high') visibleCars = [...visibleCars].sort((a, b) => a.price - b.price)
  if (sort === 'Price: high to low') visibleCars = [...visibleCars].sort((a, b) => b.price - a.price)
  if (sort === 'Lowest mileage') visibleCars = [...visibleCars].sort((a, b) => a.mileage - b.mileage)

  const toggleSaved = (id: number) => {
    setSaved((current) => current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id])
  }

  const openCar = (car: Car) => {
    setSelectedCar(car)
    setSent(false)
  }

  const closeCar = () => {
    setSelectedCar(null)
    setSent(false)
  }

  const submitInquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSent(true)
  }

  return (
    <div className="site-shell">
      <div className="topline">
        <span>Good cars. Good people. No guesswork.</span>
        <a href="#how-it-works">How we find them <ArrowRight size={13} aria-hidden="true" /></a>
      </div>

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Morrow Motor home">
          <span className="brand-mark">M</span>
          <span>MORROW<span className="wordmark-small">MOTOR CO.</span></span>
        </a>
        <nav className="primary-nav" aria-label="Main navigation">
          <a className="nav-active" href="#inventory">Find a car</a>
          <a href="#how-it-works">Our standard</a>
          <a href="#journal">Field notes</a>
        </nav>
        <div className="header-actions">
          <button className={`saved-nav ${savedOnly ? 'is-active' : ''}`} type="button" onClick={() => setSavedOnly(!savedOnly)} aria-label={`${saved.length} saved cars`} title="Show saved cars">
            <Heart size={17} fill={savedOnly ? 'currentColor' : 'none'} />
            <span>Saved</span><span className="saved-count">{saved.length}</span>
          </button>
          <a className="header-contact" href="mailto:hello@morrowmotor.co">Talk to a human <ArrowRight size={14} /></a>
        </div>
      </header>

      <main id="top">
        <section className="intro-row" aria-labelledby="page-title">
          <div>
            <p className="eyebrow"><span className="eyebrow-dot" /> THE MORROW COLLECTION <span className="eyebrow-rule" /></p>
            <h1 id="page-title">A better kind of <em>car search.</em></h1>
          </div>
          <p className="intro-copy">Characterful cars, carefully chosen.<br />Ready for whatever comes next.</p>
        </section>

        <section className="feature" aria-label="Featured car">
          <img className="feature-image" src={featuredCar.image} alt="Red Porsche 911 parked on a mountain road" />
          <div className="feature-shade" />
          <div className="feature-topline"><span><Sparkles size={14} /> THIS WEEK'S FIND</span><span>01 / 08</span></div>
          <div className="feature-copy">
            <p className="feature-kicker">1991 / AIR-COOLED / 964</p>
            <h2>The one you<br />keep looking back at.</h2>
            <p className="feature-model">Porsche 911 Carrera / Guards Red</p>
            <div className="feature-bottom">
              <div className="feature-price">{money(featuredCar.price)} <span>/ {mileage(featuredCar.mileage)} mi</span></div>
              <button className="feature-button" type="button" onClick={() => openCar(featuredCar)}>Meet the 911 <ArrowRight size={16} /></button>
            </div>
          </div>
          <div className="feature-index"><span>CURATED, NOT CROWDED</span><span>PORTLAND, OREGON</span></div>
        </section>

        <section className="inventory-section" id="inventory" aria-labelledby="inventory-title">
          <div className="inventory-heading">
            <div>
              <p className="section-kicker">THE CURRENT LINEUP <span className="section-kicker-line" /></p>
              <h2 id="inventory-title">Find your next <em>favorite.</em></h2>
            </div>
            <p className="inventory-note">Every one of these passed<br />the Morrow once-over.</p>
          </div>

          <div className="filter-panel" aria-label="Filter car listings">
            <label className="search-control">
              <Search size={18} aria-hidden="true" />
              <input type="search" placeholder="Try 'Porsche' or '1991'" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search make, model, or year" />
            </label>
            <label className="select-control">
              <span>MAKE</span>
              <select value={make} onChange={(event) => setMake(event.target.value)} aria-label="Filter by make">
                <option>Any make</option>
                {[...new Set(cars.map((car) => car.make))].sort().map((item) => <option key={item}>{item}</option>)}
              </select><ChevronDown size={14} aria-hidden="true" />
            </label>
            <label className="select-control">
              <span>BODY</span>
              <select value={body} onChange={(event) => setBody(event.target.value)} aria-label="Filter by body style">
                <option>Any body</option>
                {[...new Set(cars.map((car) => car.body))].sort().map((item) => <option key={item}>{item}</option>)}
              </select><ChevronDown size={14} aria-hidden="true" />
            </label>
            <label className="select-control year-select">
              <span>YEAR</span>
              <select value={yearRange} onChange={(event) => setYearRange(event.target.value)} aria-label="Filter by year">
                <option>Any year</option><option>Before 1990</option><option>1990s</option><option>2000s</option><option>2010+</option>
              </select><ChevronDown size={14} aria-hidden="true" />
            </label>
            <label className="select-control price-select">
              <span>MAX PRICE</span>
              <select value={priceCap} onChange={(event) => setPriceCap(event.target.value)} aria-label="Filter by maximum price">
                <option>Any price</option><option value="50000">$50,000</option><option value="75000">$75,000</option><option value="100000">$100,000</option>
              </select><ChevronDown size={14} aria-hidden="true" />
            </label>
            <button className="filter-icon-button" type="button" onClick={() => { setQuery(''); setMake('Any make'); setBody('Any body'); setYearRange('Any year'); setPriceCap('Any price'); setSavedOnly(false) }} title="Clear filters" aria-label="Clear all filters"><SlidersHorizontal size={17} /></button>
          </div>

          <div className="results-bar">
            <p><strong>{visibleCars.length.toString().padStart(2, '0')}</strong> cars worth a closer look{savedOnly ? ' / saved' : ''}</p>
            <div className="results-controls">
              <label className="sort-control"><span>SORT</span><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort listings"><option>Recently added</option><option>Price: low to high</option><option>Price: high to low</option><option>Lowest mileage</option></select><ChevronDown size={14} /></label>
              <span className="control-divider" />
              <div className="view-switch" aria-label="Listing view">
                <button className={layout === 'grid' ? 'selected' : ''} type="button" onClick={() => setLayout('grid')} aria-label="Grid view" title="Grid view"><LayoutGrid size={17} /></button>
                <button className={layout === 'list' ? 'selected' : ''} type="button" onClick={() => setLayout('list')} aria-label="List view" title="List view"><List size={18} /></button>
              </div>
            </div>
          </div>

          {visibleCars.length > 0 ? <div className={`car-grid ${layout === 'list' ? 'list-layout' : ''}`}>
            {visibleCars.map((car) => <article className="car-card" key={car.id}>
              <div className="car-image-wrap">
                <button className="car-image-button" type="button" onClick={() => openCar(car)} aria-label={`View ${car.year} ${car.make} ${car.model}`}>
                  <img src={car.image} alt={`${car.year} ${car.make} ${car.model}`} loading="lazy" />
                </button>
                {car.label && <span className="car-label">{car.label}</span>}
                <button className={`favorite-button ${saved.includes(car.id) ? 'is-saved' : ''}`} type="button" onClick={() => toggleSaved(car.id)} aria-label={saved.includes(car.id) ? `Remove ${car.model} from saved cars` : `Save ${car.model}`} title={saved.includes(car.id) ? 'Remove from saved' : 'Save car'}>
                  <Heart size={17} fill={saved.includes(car.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
              <div className="car-card-copy">
                <div className="car-title-row"><p className="car-year">{car.year}</p><p className="car-price">{money(car.price)}</p></div>
                <button className="car-name" type="button" onClick={() => openCar(car)}>{car.make} <span>{car.model}</span></button>
                <p className="car-trim">{car.trim}</p>
                <div className="car-specs"><span><Gauge size={14} /> {mileage(car.mileage)} mi</span><span><span className="spec-dot" /> {car.transmission}</span></div>
                <div className="car-location"><MapPin size={13} /> {car.location}<button type="button" onClick={() => openCar(car)} aria-label={`View details for ${car.model}`}><ArrowRight size={16} /></button></div>
              </div>
            </article>)}
          </div> : <div className="empty-state"><span className="empty-icon"><Search size={21} /></span><h3>No cars in this lane.</h3><p>Try widening your search or clearing a filter.</p><button type="button" onClick={() => { setQuery(''); setMake('Any make'); setBody('Any body'); setYearRange('Any year'); setPriceCap('Any price'); setSavedOnly(false) }}>Reset search <ArrowRight size={15} /></button></div>}
        </section>

        <section className="standard-band" id="how-it-works">
          <div className="standard-symbol"><span>MM</span><span className="symbol-dot" /></div>
          <div className="standard-copy"><p className="section-kicker">OUR STANDARD <span className="section-kicker-line" /></p><h2>Good cars don't need<br />a hard sell.</h2></div>
          <p className="standard-description">We look for honest history, thoughtful ownership, and that hard-to-name something. Then we tell you exactly what we found. No mystery fees. No theater.</p>
          <a className="standard-link" href="mailto:hello@morrowmotor.co">A little more about us <ArrowRight size={16} /></a>
        </section>

        <footer className="site-footer" id="journal"><a className="footer-wordmark" href="#top">MORROW MOTOR CO.</a><span>For the long way home.</span><span>(c) 2026 MORROW MOTOR CO.</span></footer>
      </main>

      {selectedCar && <div className="modal-backdrop" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) closeCar() }}>
        <section className="car-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <button className="modal-close" type="button" onClick={closeCar} aria-label="Close listing"><X size={19} /></button>
          <div className="modal-image"><img src={selectedCar.image} alt={`${selectedCar.year} ${selectedCar.make} ${selectedCar.model}`} /></div>
          <div className="modal-content">
            <p className="section-kicker">MORROW VERIFIED <span className="section-kicker-line" /></p>
            <p className="modal-year">{selectedCar.year} / {selectedCar.trim}</p>
            <h2 id="modal-title">{selectedCar.make} <em>{selectedCar.model}</em></h2>
            <p className="modal-price">{money(selectedCar.price)} <span>/ {mileage(selectedCar.mileage)} miles</span></p>
            <div className="modal-specs"><span><CalendarDays size={15} /> {selectedCar.year}</span><span><Gauge size={15} /> {mileage(selectedCar.mileage)} mi</span><span><Fuel size={15} /> {selectedCar.fuel}</span><span><MapPin size={15} /> {selectedCar.location}</span></div>
            {sent ? <div className="sent-state"><span><Check size={17} /></span><div><strong>You're on our list.</strong><p>A Morrow person will be in touch shortly.</p></div></div> : <form className="inquiry-form" onSubmit={submitInquiry}>
              <label>Your name<input name="name" autoComplete="name" placeholder="First and last" required /></label>
              <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
              <button className="inquiry-button" type="submit">Ask about this car <ArrowRight size={16} /></button>
              <p className="form-note">A real person, a straight answer. Usually same day.</p>
            </form>}
          </div>
        </section>
      </div>}
    </div>
  )
}

export default App
