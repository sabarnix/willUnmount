'use client'

import { Comments as CommentsComponent } from 'pliny/comments/index.js'
import siteMetadata from '@/data/siteMetadata'

export default function Comments({ slug }: { slug: string }) {
  if (!siteMetadata.comments?.provider) {
    return null
  }

  // Check if Giscus configuration is complete
  const isGiscusConfigured =
    siteMetadata.comments.provider === 'giscus' &&
    siteMetadata.comments.giscusConfig.repo &&
    siteMetadata.comments.giscusConfig.repositoryId &&
    siteMetadata.comments.giscusConfig.category &&
    siteMetadata.comments.giscusConfig.categoryId

  if (siteMetadata.comments.provider === 'giscus' && !isGiscusConfigured) {
    console.error('Giscus is not fully configured. Check environment variables.')
    return (
      <div className="rounded-md border border-red-500 p-4 text-red-500">
        Comments configuration is missing. Please check your environment variables.
      </div>
    )
  }

  return <CommentsComponent commentsConfig={siteMetadata.comments} slug={slug} />
}
