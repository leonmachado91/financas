# Proposta: Adaptar Melhorias Desktop para Mobile

## Resumo

Durante as melhorias de desktop, criamos componentes e estilos que não foram aplicados ao mobile. Esta proposta visa unificar a experiência.

---

## Diferenças Atuais

| Recurso | Desktop | Mobile |
|---------|---------|--------|
| **DatePicker** | `DatePicker` customizado com seleção de mês/ano | Input `type="date"` nativo (feio) |
| **Popover/Calendar** | Visual dark mode integrado | N/A |
| **Dialog animation** | Fade + zoom do centro | Drawer padrão |

---

## Mudanças Propostas

### 1. Usar DatePicker Customizado no Mobile

#### [MODIFY] `src/components/transaction/TransactionSheet.tsx`

O `FormContent` (usado no mobile Drawer) ainda usa `<Input type="date">`.

Substituir por `<DatePicker>` para consistência:

```tsx
// Antes (mobile)
<Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

// Depois (mobile)
<DatePicker
  value={date ? parse(date, 'yyyy-MM-dd', new Date()) : undefined}
  onChange={(d) => setDate(format(d, 'yyyy-MM-dd'))}
  placeholder="Data"
/>
```

---

## Arquivos Afetados

| Arquivo | Mudança |
|---------|---------|
| `src/components/transaction/TransactionSheet.tsx` | Usar DatePicker no FormContent mobile |

---

## Verificação

### Teste Manual
1. Abrir app no mobile (ou redimensionar janela para < 768px)
2. Clicar em "+ Despesa" ou "+ Receita"
3. Verificar se o campo de data usa o DatePicker customizado
4. Selecionar uma data e confirmar que funciona
