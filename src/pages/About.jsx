import { Star, Users, GraduationCap, Heart } from 'lucide-react'
import './About.css'

export default function About() {
  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <span className="about-badge">Est. 2020</span>
            <h1>Born in Rangpur,<br />Built for <span>Rangpurians</span></h1>
            <p>
              KHAIM was founded to bring the authentic flavors of Rangpur's street food 
              and home cooking to one place — affordable, fresh, and full of love.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container">
          <div className="story-grid">
            <div className="story-image clay-card">
              <img 
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600" 
                alt="Restaurant interior" 
              />
            </div>
            <div className="story-content">
              <h2>Our Story</h2>
              <p>
                Starting from a small kitchen in Shapla Chattar, KHAIM has grown to become 
                one of Rangpur's most beloved dining destinations. We believe that great food 
                brings people together.
              </p>
              <p>
                Every dish we prepare is made with locally sourced ingredients and prepared 
                with the same love and care you'd expect from home cooking. Our chefs bring 
                years of experience in traditional Bangladeshi cuisine.
              </p>
              <div className="story-stats">
                <div className="stat-item">
                  <span className="stat-number">5+</span>
                  <span className="stat-label">Years</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Customers</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Dishes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audience */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Who We Serve</h2>
            <p>KHAIM is for everyone</p>
          </div>
          
          <div className="audience-grid">
            <div className="audience-card clay-card">
              <div className="audience-icon">
                <Users size={32} />
              </div>
              <h3>Families</h3>
              <p>Perfect spot for family gatherings with our spacious seating and kid-friendly menu</p>
            </div>
            <div className="audience-card clay-card">
              <div className="audience-icon">
                <GraduationCap size={32} />
              </div>
              <h3>Students</h3>
              <p>Affordable meals perfect for college hangouts and study sessions</p>
            </div>
            <div className="audience-card clay-card">
              <div className="audience-icon">
                <Heart size={32} />
              </div>
              <h3>Couples</h3>
              <p>Romantic ambiance for date nights and special occasions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Badge */}
      <section className="section">
        <div className="container">
          <div className="quality-badge clay-card">
            <div className="quality-stars">⭐⭐⭐⭐</div>
            <h2>4-Star Quality</h2>
            <p>Recognized for excellence in food quality, service, and customer satisfaction</p>
            <span className="quality-tagline">Taste of Rangpurian's</span>
          </div>
        </div>
      </section>
    </div>
  )
}
