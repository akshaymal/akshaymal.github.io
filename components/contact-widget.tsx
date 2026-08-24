import Link from 'next/link'
import { Github, Linkedin, Instagram, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/akshaymal', icon: Github },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/akshaymal', icon: Linkedin },
  { label: 'Instagram', href: 'https://instagram.com/akshaymal', icon: Instagram },
  { label: 'Email', href: 'mailto:malhotraakshay1997@gmail.com,amalho23@asu.edu', icon: Mail },
]

export function ContactWidget() {
  return (
    <div
      className="fixed bottom-4 right-4 z-40 flex items-center gap-0.5 rounded-full border border-border bg-background p-1 shadow-lg sm:bottom-6 sm:right-6"
      aria-label="Contact links"
    >
      {socialLinks.map((link) => {
        const isMailto = link.href.startsWith('mailto:')
        return (
          <Button key={link.label} asChild variant="ghost" size="icon" className="rounded-full">
            <Link
              href={link.href}
              target={isMailto ? undefined : '_blank'}
              rel={isMailto ? undefined : 'noopener noreferrer'}
              aria-label={link.label}
            >
              <link.icon className="h-4 w-4" />
            </Link>
          </Button>
        )
      })}
    </div>
  )
}
