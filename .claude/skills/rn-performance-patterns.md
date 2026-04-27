# React Native Performance Patterns

## The FlashList contract
```typescript
<FlashList
  data={items}
  renderItem={({ item }) => <MemoizedItem item={item} />}  // always memo
  estimatedItemSize={MEASURED_ITEM_HEIGHT}  // measure once; never guess
  getItemType={item => item.type}           // for heterogeneous lists
  keyExtractor={item => item.id}
  removeClippedSubviews={true}             // default true, be explicit
/>
```
Rule: every list > 10 items uses FlashList. No FlatList in production.

## Measuring estimatedItemSize
```typescript
// In development, log the actual height:
onLayout={({ nativeEvent: { layout: { height } } }) => {
  if (__DEV__) console.log('ItemHeight:', height);  // remove before shipping
}}
// Then set estimatedItemSize to the logged value
```

## The memo pattern
```typescript
const Item = React.memo(ItemBase, (prev, next) =>
  // Only re-render if these specific fields changed
  prev.item.id === next.item.id &&
  prev.item.updatedAt === next.item.updatedAt &&
  prev.isSelected === next.isSelected
);
```

## Avoiding anonymous functions in JSX
```typescript
// BAD — creates new function on every render
<Item onPress={() => navigate(item.id)} />

// GOOD — stable reference
const handlePress = useCallback(() => navigate(item.id), [item.id]);
<Item onPress={handlePress} />
```

## Launch performance
- Use expo-splash-screen to keep splash visible until DB hydrated
- Hydrate WatermelonDB before rendering the account list
- Defer non-critical init (PostHog, learning agent) with setTimeout(fn, 0)

## Memory management
- Unsubscribe from WatermelonDB observations in useEffect cleanup
- Destroy Voice in cleanup: `Voice.destroy().then(Voice.removeAllListeners)`
- Cancel in-flight fetch requests in useEffect cleanup
