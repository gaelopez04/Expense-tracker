export function parsingPassword(password: string): boolean {
  return password.length >= 8 && /[A-Z]/.test(password);
}

export function testName(name: string): boolean {
  return name.trim().split(/\s+/).length > 1;
}

export function verifyBudget(amount: string): boolean {
  return amount.trim() !== '' && Number.isFinite(Number(amount));
}
