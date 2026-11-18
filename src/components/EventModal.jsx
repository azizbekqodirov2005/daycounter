import { useEffect, useId, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { Modal } from './Modal';
import {
  CATEGORIES,
  COLORS,
  DEFAULT_CATEGORY,
  DEFAULT_COLOR,
} from '../utils/constants';
import { parseDateInput, parseTimeInput, todayAsInputValue } from '../utils/dateUtils';

const NAME_MAX = 60;
const NOTE_MAX = 200;

const emptyForm = () => ({
  name: '',
  category: DEFAULT_CATEGORY,
  date: todayAsInputValue(),
  time: '',
  note: '',
  color: DEFAULT_COLOR,
  recurring: false,
});

const toForm = (event) =>
  event
    ? {
        name: event.name,
        category: event.category,
        date: event.date,
        time: event.time ?? '',
        note: event.note ?? '',
        color: event.color,
        recurring: Boolean(event.recurring),
      }
    : emptyForm();

const validate = (form) => {
  const errors = {};

  const name = form.name.trim();
  if (!name) {
    errors.name = 'Sana nomini kiriting.';
  } else if (name.length > NAME_MAX) {
    errors.name = `Nom ${NAME_MAX} ta belgidan oshmasligi kerak.`;
  }

  if (!form.date) {
    errors.date = 'Sanani tanlang.';
  } else if (!parseDateInput(form.date)) {
    errors.date = "Sana noto‘g‘ri. To‘g‘ri format: YYYY-MM-DD.";
  }

  if (form.time && !parseTimeInput(form.time)) {
    errors.time = "Vaqt noto‘g‘ri. To‘g‘ri format: SS:DD.";
  }

  if (form.note.length > NOTE_MAX) {
    errors.note = `Izoh ${NOTE_MAX} ta belgidan oshmasligi kerak.`;
  }

  return errors;
};

export function EventModal({ event, onClose, onSubmit }) {
  const [form, setForm] = useState(() => toForm(event));
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);
  const id = useId();

  const isEditing = Boolean(event);

  useEffect(() => {
    if (!submitted) return;
    setErrors(validate(form));
  }, [form, submitted]);

  const setField = (field) => (value) =>
    setForm((previous) => ({ ...previous, [field]: value }));

  const handleSubmit = (submitEvent) => {
    submitEvent.preventDefault();
    setSubmitted(true);

    const nextErrors = validate(form);
    setErrors(nextErrors);

    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      formRef.current?.querySelector(`[name="${firstError}"]`)?.focus();
      return;
    }

    onSubmit({
      ...form,
      name: form.name.trim(),
      note: form.note.trim(),
    });
  };

  const fieldId = (field) => `${id}-${field}`;
  const errorId = (field) => `${id}-${field}-error`;

  return (
    <Modal
      title={isEditing ? 'Sanani tahrirlash' : "Yangi sana qo‘shish"}
      description={
        isEditing
          ? "Ma’lumotlarni yangilang va saqlang."
          : "Muhim sanani kiriting — countdown darhol boshlanadi."
      }
      onClose={onClose}
    >
      <form className="form" onSubmit={handleSubmit} ref={formRef} noValidate>
        <div className="field">
          <label className="field__label" htmlFor={fieldId('name')}>
            Sana nomi <span aria-hidden="true">*</span>
          </label>
          <input
            id={fieldId('name')}
            name="name"
            className="input"
            type="text"
            value={form.name}
            onChange={(e) => setField('name')(e.target.value)}
            placeholder={'Masalan: Azizbekning tug‘ilgan kuni'}
            maxLength={NAME_MAX + 10}
            autoComplete="off"
            aria-invalid={errors.name ? 'true' : undefined}
            aria-describedby={errors.name ? errorId('name') : undefined}
            required
          />
          {errors.name ? (
            <p className="field__error" id={errorId('name')} role="alert">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="field">
          <label className="field__label" htmlFor={fieldId('category')}>
            Sana turi
          </label>
          <select
            id={fieldId('category')}
            name="category"
            className="input"
            value={form.category}
            onChange={(e) => setField('category')(e.target.value)}
          >
            {CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form__row">
          <div className="field">
            <label className="field__label" htmlFor={fieldId('date')}>
              Sana <span aria-hidden="true">*</span>
            </label>
            <input
              id={fieldId('date')}
              name="date"
              className="input"
              type="date"
              value={form.date}
              onChange={(e) => setField('date')(e.target.value)}
              min="1900-01-01"
              max="2999-12-31"
              aria-invalid={errors.date ? 'true' : undefined}
              aria-describedby={errors.date ? errorId('date') : undefined}
              required
            />
            {errors.date ? (
              <p className="field__error" id={errorId('date')} role="alert">
                {errors.date}
              </p>
            ) : null}
          </div>

          <div className="field">
            <label className="field__label" htmlFor={fieldId('time')}>
              Vaqt <span className="field__optional">(ixtiyoriy)</span>
            </label>
            <input
              id={fieldId('time')}
              name="time"
              className="input"
              type="time"
              value={form.time}
              onChange={(e) => setField('time')(e.target.value)}
              aria-invalid={errors.time ? 'true' : undefined}
              aria-describedby={errors.time ? errorId('time') : undefined}
            />
            {errors.time ? (
              <p className="field__error" id={errorId('time')} role="alert">
                {errors.time}
              </p>
            ) : null}
          </div>
        </div>

        <div className="field">
          <label className="field__label" htmlFor={fieldId('note')}>
            Izoh <span className="field__optional">(ixtiyoriy)</span>
          </label>
          <textarea
            id={fieldId('note')}
            name="note"
            className="input input--textarea"
            value={form.note}
            onChange={(e) => setField('note')(e.target.value)}
            rows={3}
            maxLength={NOTE_MAX + 20}
            placeholder={'Qisqacha eslatma yozib qo‘ying'}
            aria-invalid={errors.note ? 'true' : undefined}
            aria-describedby={errors.note ? errorId('note') : undefined}
          />
          {errors.note ? (
            <p className="field__error" id={errorId('note')} role="alert">
              {errors.note}
            </p>
          ) : null}
        </div>

        <fieldset className="field field--fieldset">
          <legend className="field__label">Rang</legend>
          <div className="color-picker" role="radiogroup" aria-label="Karta rangi">
            {COLORS.map((color) => {
              const selected = form.color === color.id;
              return (
                <button
                  key={color.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={color.label}
                  title={color.label}
                  className={`color-swatch${selected ? ' is-selected' : ''}`}
                  style={{ '--swatch': color.value }}
                  onClick={() => setField('color')(color.id)}
                >
                  {selected ? <Check size={14} aria-hidden="true" /> : null}
                </button>
              );
            })}
          </div>
        </fieldset>

        <label className="checkbox" htmlFor={fieldId('recurring')}>
          <input
            id={fieldId('recurring')}
            name="recurring"
            type="checkbox"
            checked={form.recurring}
            onChange={(e) => setField('recurring')(e.target.checked)}
          />
          <span>
            Har yili takrorlanadi
            <span className="checkbox__hint">
              Tug&lsquo;ilgan kun va yilliklar uchun. 29-fevral kabisa
              bo&lsquo;lmagan yillarda 28-fevralda hisoblanadi.
            </span>
          </span>
        </label>

        <div className="modal__footer">
          <button type="button" className="button button--ghost" onClick={onClose}>
            Bekor qilish
          </button>
          <button type="submit" className="button button--primary">
            {isEditing ? "O‘zgarishlarni saqlash" : "Qo‘shish"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
