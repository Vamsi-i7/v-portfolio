import { useState } from 'react'
import { useCertificates } from '@/hooks/queries/useCertificates'
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection'
import { getPublicUrl } from '@/lib/storage'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, ExternalLink, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Tables } from '@/types/database.types'

export function Certificates() {
  const { data: certificates, isLoading } = useCertificates()
  const [selectedCert, setSelectedCert] = useState<Tables<'certificates'> | null>(null)

  if (isLoading || !certificates?.length) return null

  return (
    <AnimatedSection id="certifications" className="section-container relative" aria-labelledby="certs-title">
      <div className="mb-12">
        <span className="section-label">Verified Proof</span>
        <h2 id="certs-title" className="text-section font-display font-bold tracking-tight mt-2">
          Certifications
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert, index) => {
          const year = new Date(cert.issued_at).getFullYear()
          const logoUrl = cert.issuer_logo_path ? getPublicUrl('portfolio-assets', cert.issuer_logo_path) : null
          const hasImage = !!cert.certificate_image_path

          return (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-bg-surface border border-bg-border rounded-xl overflow-hidden shadow-sm hover:shadow-glow-accent hover:border-accent-primary transition-all"
            >
              {/* Image Preview Area */}
              <div 
                className={`relative aspect-video w-full border-b border-bg-border overflow-hidden ${hasImage ? 'cursor-pointer' : 'bg-bg-elevated'}`}
                onClick={() => hasImage && setSelectedCert(cert)}
              >
                {hasImage ? (
                  <>
                    <img 
                      src={getPublicUrl('portfolio-assets', cert.certificate_image_path!)} 
                      alt={cert.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-xs font-bold text-white flex items-center gap-2">
                        View Credential <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 opacity-50">
                    <Award className="w-8 h-8 text-text-muted" />
                    <span className="text-[10px] font-mono tracking-widest uppercase">Verified Record</span>
                  </div>
                )}
              </div>

              {/* Meta Area */}
              <div className="p-5 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-white flex items-center justify-center shrink-0 overflow-hidden border border-bg-border">
                    {logoUrl ? (
                      <img src={logoUrl} alt={cert.issuer_name} className="w-full h-full object-contain p-1" />
                    ) : (
                      <Award className="w-4 h-4 text-black" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-primary truncate leading-tight" title={cert.title}>{cert.title}</h3>
                    <p className="text-xs text-text-secondary mt-1">{cert.issuer_name}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest bg-bg-elevated px-2 py-1 rounded">
                    {year}
                  </span>
                  {cert.verification_url && (
                    <a 
                      href={cert.verification_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-accent-primary hover:text-accent-primary-dark transition-colors flex items-center gap-1"
                    >
                      Verify <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Modal for full credential viewing */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-xl"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl w-full bg-bg-surface border border-bg-border rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-bg-border bg-bg-elevated/50 shrink-0">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-accent-primary shrink-0" />
                  <h3 className="font-bold text-primary truncate">{selectedCert.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedCert(null)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors shrink-0 ml-2"
                >
                  <X className="w-5 h-5 text-text-secondary" />
                </button>
              </div>
              
              <div className="p-4 md:p-10 overflow-y-auto flex-1 flex items-center justify-center bg-black/40 min-h-0">
                <img 
                  src={getPublicUrl('portfolio-assets', selectedCert.certificate_image_path)} 
                  alt={selectedCert.title}
                  className="max-w-full max-h-[50vh] md:max-h-[70vh] object-contain rounded shadow-lg border border-white/10"
                />
              </div>

              <div className="p-4 border-t border-bg-border bg-bg-elevated/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
                <span className="text-sm text-text-secondary font-medium">Issued by {selectedCert.issuer_name}</span>
                {selectedCert.verification_url && (
                  <Button asChild size="sm" className="w-full sm:w-auto bg-accent-primary text-black font-bold hover:bg-accent-primary-dark">
                    <a href={selectedCert.verification_url} target="_blank" rel="noopener noreferrer">
                      Verify Authenticity <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedSection>
  )
}
