import Link from 'next/link'
import { Github, Linkedin, Instagram, Mail } from 'lucide-react'

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/akshaymal', icon: Github },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/akshaymal', icon: Linkedin },
  { label: 'Instagram', href: 'https://instagram.com/akshaymal', icon: Instagram },
  { label: 'Email', href: 'mailto:malhotraakshay1997@gmail.com,amalho23@asu.edu', icon: Mail },
]

export function ContactWidget() {
  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      <div className="flex items-center gap-2.5 rounded-full border border-border bg-card px-3.5 py-2.5 text-card-foreground shadow-lg sm:gap-4 sm:px-5 sm:py-3">
        <span className="whitespace-nowrap text-sm font-medium">Let&apos;s connect</span>
        <div className="flex items-center gap-3 sm:gap-3.5">
          {socialLinks.map((link) => {
            const isMailto = link.href.startsWith('mailto:')
            return (
              <Link
                key={link.label}
                href={link.href}
                target={isMailto ? undefined : '_blank'}
                rel={isMailto ? undefined : 'noopener noreferrer'}
                aria-label={link.label}
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <link.icon className="h-4 w-4" />
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
