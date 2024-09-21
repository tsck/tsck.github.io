import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import createEmotionServer from "@emotion/server/create-instance";
import { useServerInsertedHTML } from "next/navigation";
import { useState } from "react";

const cache = createCache({ key: "css" });
const { extractCriticalToChunks, constructStyleTagsFromChunks } =
  createEmotionServer(cache);

export default function RootLayout({ children }) {
  const [cache] = useState(() => createCache({ key: "css" }));

  useServerInsertedHTML(() => {
    const chunks = extractCriticalToChunks(children);
    const styles = constructStyleTagsFromChunks(chunks);
    return <style dangerouslySetInnerHTML={{ __html: styles }} />;
  });

  return (
    <html lang="en">
      <head />
      <body>
        <CacheProvider value={cache}>{children}</CacheProvider>
      </body>
    </html>
  );
}
