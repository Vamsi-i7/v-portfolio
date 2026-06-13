import { useCertificates } from '@/hooks/queries/useCertificates'
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection'
import { BadgeCheck, Calendar, Shield, ArrowRight, Award } from 'lucide-react'
import { getPublicUrl } from '@/lib/storage'

export function Certificates() {
  const { data: certificates, isLoading } = useCertificates()

  if (isLoading || !certificates?.length) return null

  return (
    <AnimatedSection id="certificates" className="section-container" aria-labelledby="certificates-title">
      <div className="mb-10 md:mb-16">
        <span className="section-label mb-2">Verified Proof</span>
        <h2 id="certificates-title" className="text-section font-display font-bold tracking-tight mb-4">
          Licenses & Certifications
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Official credentials, validated expertise, and industry-recognized certifications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates
          .sort((a, b) => new Date(b.issued_at).getTime() - new Date(a.issued_at).getTime())
          .map((cert) => {
            const isFeatured = cert.is_featured
            
            const formattedDate = new Date(cert.issued_at).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric'
            })

            return (
              <div 
                key={cert.id} 
                className={`glass-card border border-border/50 flex flex-col sm:flex-row overflow-hidden group transition-all duration-300 hover:border-accent/40 hover:shadow-[0_8px_30px_rgb(var(--accent-rgb),0.08)] bg-surface/30 hover:bg-surface/60 ${
                  isFeatured ? 'md:col-span-2' : ''
                }`}
              >
                {/* Image Proof Strip (Optional) */}
                {cert.certificate_image_path && (
                  <div className={`relative flex-shrink-0 bg-muted/10 border-b sm:border-b-0 sm:border-r border-border/50 overflow-hidden ${
                    isFeatured ? 'h-48 sm:h-auto sm:w-64' : 'h-40 sm:h-auto sm:w-48'
                  }`}>
                    <a 
                      href={getPublicUrl('portfolio-assets', cert.certificate_image_path)} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="block w-full h-full relative cursor-zoom-in group/image"
                      title="View full certificate"
                    >
                      <div className="absolute inset-0 bg-accent/0 group-hover/image:bg-accent/10 transition-colors duration-300 z-10 flex items-center justify-center">
                         <div className="bg-background/80 backdrop-blur text-foreground text-xs font-semibold px-3 py-1.5 rounded-full opacity-0 group-hover/image:opacity-100 transform translate-y-2 group-hover/image:translate-y-0 transition-all duration-300 shadow-sm border border-border/50">
                           View Document
                         </div>
                      </div>
                      <img 
                        src={getPublicUrl('portfolio-assets', cert.certificate_image_path)} 
                        loading="lazy" 
                        alt={`${cert.title} Document`}
                        className="w-full h-full object-cover opacity-80 group-hover/image:opacity-100 transition-all duration-500 scale-100 group-hover/image:scale-105"
                      />
                    </a>
                  </div>
                )}

                {/* Content Area */}
                <div className="p-5 md:p-6 flex-1 flex flex-col justify-between relative">
                  {/* Subtle Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
                    {/* Trust Anchor: Issuer Logo + Verified Seal */}
                    <div className="relative flex-shrink-0 mb-2 sm:mb-0">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-surface border border-border/60 flex items-center justify-center p-2.5 shadow-sm group-hover:border-accent/30 transition-colors">
                        {cert.issuer_logo_path ? (
                          <img 
                            src={getPublicUrl('portfolio-assets', cert.issuer_logo_path)} 
                            alt={cert.issuer_name}
                            loading="lazy"
                            className="w-full h-full object-contain filter group-hover:brightness-110 transition-all"
                          />
                        ) : (
                          <Award className="w-8 h-8 text-muted-foreground/50 group-hover:text-accent/70 transition-colors" />
                        )}
                      </div>
                      {/* Premium Verified Seal */}
                      <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-0.5 shadow-sm border border-border/30">
                        <BadgeCheck className="w-6 h-6 text-accent fill-accent/10" />
                      </div>
                    </div>
                    
                    {/* Header Text */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-lg md:text-xl text-foreground leading-tight group-hover:text-accent transition-colors duration-300">
                        {cert.title}
                      </h3>
                      <div className="text-foreground/80 font-semibold text-sm mt-1.5">
                        {cert.issuer_name}
                      </div>
                    </div>
                  </div>

                  {/* Metadata & Actions */}
                  <div className="relative z-10 space-y-5">
                    {/* Secure Metadata Tokens */}
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground bg-muted/30 px-2.5 py-1 rounded-md border border-border/30">
                        <Calendar className="w-3.5 h-3.5 opacity-70" />
                        <span>Issued: {formattedDate}</span>
                      </div>
                      {cert.credential_id && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-muted/40 rounded-md border border-border/50 text-muted-foreground font-mono font-medium tracking-wide">
                          <Shield className="w-3.5 h-3.5 text-accent/70" />
                          <span>ID: {cert.credential_id}</span>
                        </div>
                      )}
                    </div>

                    {/* Verification CTA */}
                    {cert.verification_url && (
                      <div className="pt-2 border-t border-border/30">
                        <a 
                          href={cert.verification_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-semibold text-accent hover:text-accent/80 transition-colors group/link"
                        >
                          Verify Credential 
                          <ArrowRight className="w-4 h-4 ml-1.5 opacity-60 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
        })}
      </div>
    </AnimatedSection>
  )
}
