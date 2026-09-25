import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [css, workspace, accountGate] = await Promise.all([
  readFile("app/globals.css", "utf8"),
  readFile("app/workspace.tsx", "utf8"),
  readFile("app/account-gate.tsx", "utf8"),
]);

test("defines semantic interface tokens and an accessible primary action", () => {
  for (const token of [
    "--brand-accent",
    "--surface-page",
    "--surface-card",
    "--text-primary",
    "--text-secondary",
    "--action-primary-background",
    "--action-primary-foreground",
    "--focus-ring",
  ]) {
    assert.match(css, new RegExp(`${token}:`));
  }

  assert.match(
    css,
    /\.btn\.primary\s*\{[^}]*background:\s*var\(--action-primary-background\)[^}]*color:\s*var\(--action-primary-foreground\)/s,
  );
  assert.match(css, /--action-primary-foreground:\s*#171717/i);
});

test("uses one explicit temporary brand mark instead of repeated text logos", () => {
  assert.match(workspace, /<BrandMark\s*\/>/);
  assert.match(accountGate, /<BrandMark\s*\/?>/);
  assert.match(accountGate, /<span className="auth-brand-copy">РРС Тюмень · Внешний персонал<\/span>/);
  assert.match(css, /\.auth-brand-copy\s*\{/);
  assert.doesNotMatch(css, /\.auth-brand span\s*\{/);
  assert.doesNotMatch(workspace, /className="brand"><span>DNS<\/span>/);
  assert.doesNotMatch(accountGate, /className="auth-brand"><b>DNS<\/b>/);
});

test("keeps owner PIN recovery reachable in the loopback local preview", () => {
  assert.match(accountGate, /status\?\.selfHosted\?\(status\?\.canRecoverOwner&&!recover&&<button/);
});

test("groups navigation around user workflows and names instructions clearly", () => {
  assert.match(workspace, /const navGroups=/);
  for (const label of ["Работа", "Отчёты", "Материалы", "Управление"]) {
    assert.match(workspace, new RegExp(`label:'${label}'`));
  }
  assert.match(workspace, /id:'instructions',label:'Инструкции'/);
});

test("provides a mobile shift-card representation", () => {
  assert.match(workspace, /className="shift-mobile-list"/);
  assert.match(workspace, /className="shift-mobile-card"/);
  assert.match(css, /@media\(max-width:767px\)[^{]*\{[^}]*\.shift-desktop-table/s);
  assert.match(css, /\.shift-mobile-list\s*\{[^}]*display:\s*none/s);
});
