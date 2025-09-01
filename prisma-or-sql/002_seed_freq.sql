insert into freq_words(language, lemma, rank, pos, freq) values
('DE','sein',1,'verb',0.085),
('DE','haben',2,'verb',0.072),
('ES','ser',1,'verb',0.081),
('SV','vara',1,'verb',0.079)
on conflict do nothing;
