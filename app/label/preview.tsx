import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';

import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import {
  generateProductCard,
  generateShelfTalker,
  generateDeliveryReceipt,
  printZpl,
  recordLabelPrint,
  renderZplPreview,
  type LabelTemplateType,
} from '@/zpl';

interface DemoParams {
  productName: string;
  skuCode: string;
  pricePerCase: number;
}

const DEMO: DemoParams = {
  productName: 'Yellowhammer Pale Ale',
  skuCode: 'YH-PA-HB',
  pricePerCase: 142,
};

function buildZpl(template: LabelTemplateType): { zpl: string; w: number; h: number } {
  switch (template) {
    case 'shelf_talker':
      return {
        zpl: generateShelfTalker({
          productName: DEMO.productName,
          skuCode: DEMO.skuCode,
          pricePerCase: DEMO.pricePerCase,
          promoLine: 'Cooler reset this week',
        }),
        w: 2.5,
        h: 1.5,
      };
    case 'product_card':
      return {
        zpl: generateProductCard({
          productName: DEMO.productName,
          skuCode: DEMO.skuCode,
          pricePerCase: DEMO.pricePerCase,
          facts: ['Brewed in Birmingham AL', '1/2 bbl keg', 'Year-round'],
        }),
        w: 4,
        h: 3,
      };
    case 'delivery_receipt':
      return {
        zpl: generateDeliveryReceipt({
          accountName: 'The Rail',
          orderNumber: 'OF-1042',
          deliveryDate: new Date(),
          rep: 'Jake Thornton',
          totalAmount: 548,
          lines: [
            {
              productName: 'Yellowhammer Pale Ale',
              quantity: 2,
              unit: 'keg',
              unitPrice: 178,
              lineTotal: 356,
            },
            {
              productName: 'Modelo Especial',
              quantity: 1,
              unit: 'keg',
              unitPrice: 192,
              lineTotal: 192,
            },
          ],
        }),
        w: 4,
        h: 6,
      };
  }
}

export default function LabelPreview(): React.ReactNode {
  const { template, accountId } = useLocalSearchParams<{
    template: LabelTemplateType;
    accountId?: string;
  }>();
  const offline = useOfflineStatus();
  const [pngBase64, setPngBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [printing, setPrinting] = useState(false);
  const [printResult, setPrintResult] = useState<string | null>(null);

  const built = useMemo(() => (template ? buildZpl(template) : null), [template]);

  useEffect(() => {
    if (!built) return;
    if (offline.isOffline) {
      setPngBase64(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    renderZplPreview({ zpl: built.zpl, widthInches: built.w, heightInches: built.h })
      .then((res) => {
        if (!cancelled) {
          setPngBase64(res.pngBase64);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [built, offline.isOffline]);

  if (!template || !built) {
    return (
      <View className="flex-1 items-center justify-center bg-ohanafy-paper dark:bg-ohanafy-dark-surface">
        <Text className="text-base text-ohanafy-muted dark:text-ohanafy-dark-muted">
          Missing template parameter
        </Text>
      </View>
    );
  }

  const handlePrint = async (): Promise<void> => {
    setPrinting(true);
    try {
      const result = await printZpl(built.zpl);
      if (accountId) {
        await recordLabelPrint({
          accountId,
          templateType: template,
          productName: DEMO.productName,
          printerSerial: result.printerSerial,
          zplSnapshot: built.zpl,
        });
      }
      setPrintResult(result.message);
    } finally {
      setPrinting(false);
    }
  };

  return (
    <ErrorBoundary screenName="LabelPreview">
      <ScrollView
        accessibilityLabel="Label preview"
        className="flex-1 bg-ohanafy-paper dark:bg-ohanafy-dark-surface"
        contentContainerClassName="px-4 pt-12 pb-32"
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={() => router.back()}
          className="mb-4 self-start"
        >
          <Text className="text-base text-ohanafy-denim dark:text-ohanafy-denim-light">← Back</Text>
        </Pressable>
        <Text className="mb-4 text-2xl font-bold text-ohanafy-ink dark:text-ohanafy-dark-text">
          Preview
        </Text>

        {loading ? (
          <View className="items-center justify-center py-12">
            <ActivityIndicator color="#4A5F80" />
            <Text className="mt-3 text-sm text-ohanafy-muted dark:text-ohanafy-dark-muted">
              Rendering preview…
            </Text>
          </View>
        ) : pngBase64 ? (
          <View className="items-center rounded-2xl bg-ohanafy-cork p-4 dark:bg-ohanafy-dark-elevated">
            <Image
              accessibilityLabel="Rendered label preview"
              source={{ uri: `data:image/png;base64,${pngBase64}` }}
              style={{ width: built.w * 80, height: built.h * 80 }}
              resizeMode="contain"
            />
          </View>
        ) : (
          // Offline / Labelary unreachable — show raw ZPL as the §8 contract calls for
          <View className="rounded-2xl bg-ohanafy-cork p-4 dark:bg-ohanafy-dark-elevated">
            <Text className="mb-2 text-xs font-bold uppercase tracking-wider text-ohanafy-muted dark:text-ohanafy-dark-muted">
              Offline ZPL fallback
            </Text>
            <Text className="font-mono text-xs text-ohanafy-ink dark:text-ohanafy-dark-text">
              {built.zpl}
            </Text>
          </View>
        )}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Print label"
          accessibilityState={{ disabled: printing }}
          disabled={printing}
          onPress={handlePrint}
          className={
            printing
              ? 'mt-6 rounded-xl bg-ohanafy-cork px-4 py-4 dark:bg-ohanafy-dark-elevated'
              : 'mt-6 rounded-xl bg-ohanafy-denim px-4 py-4 active:opacity-80'
          }
        >
          <Text
            className={
              printing
                ? 'text-center text-base font-bold text-ohanafy-muted'
                : 'text-center text-base font-bold text-ohanafy-paper'
            }
          >
            {printing ? 'Sending…' : 'Print to Zebra'}
          </Text>
        </Pressable>
        {printResult ? (
          <Text
            accessibilityLiveRegion="polite"
            className="mt-3 text-center text-sm text-ohanafy-muted dark:text-ohanafy-dark-muted"
          >
            {printResult}
          </Text>
        ) : null}
      </ScrollView>
    </ErrorBoundary>
  );
}
